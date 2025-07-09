import string
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from datasets import load_dataset
from PIL import Image
import torchvision.transforms as transforms

# 1. Load IAM Dataset (use a small subset for quick testing)
ds = load_dataset("Teklia/IAM-line")
ds['train'] = ds['train'].select(range(100))        # Use only 100 samples for quick test
ds['validation'] = ds['validation'].select(range(20))
ds['test'] = ds['test'].select(range(20))

# 2. Character Vocabulary (lowercase, digits, space)
characters = string.ascii_lowercase + string.digits + ' '
char_to_idx = {char: idx + 1 for idx, char in enumerate(characters)}  # 0 is blank for CTC
char_to_idx['<BLANK>'] = 0
idx_to_char = {idx: char for char, idx in char_to_idx.items()}
vocab_size = len(char_to_idx)

def encode_label(text):
    return [char_to_idx[char] for char in text if char in char_to_idx]

# 3. Image Transform
img_height = 32
img_width = 128
transform = transforms.Compose([
    transforms.Grayscale(num_output_channels=1),
    transforms.Resize((img_height, img_width)),
    transforms.ToTensor(),
    transforms.Normalize((0.5,), (0.5,))
])

# 4. Custom Dataset
class IAMLineDataset(Dataset):
    def __init__(self, split):
        self.data = ds[split]
        self.transform = transform

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        img = self.data[idx]['image']
        text = self.data[idx]['text']
        img_tensor = self.transform(img)
        label_seq = encode_label(text)
        return img_tensor, torch.tensor(label_seq, dtype=torch.long)

# 5. Collate Function for Padding
def collate_fn(batch):
    images, labels = zip(*batch)
    max_width = max(img.shape[-1] for img in images)
    padded_images = []
    for img in images:
        pad_width = max_width - img.shape[-1]
        padded = transforms.Pad((0, 0, pad_width, 0))(img)
        padded_images.append(padded)
    label_lens = torch.tensor([len(l) for l in labels], dtype=torch.long)
    padded_labels = nn.utils.rnn.pad_sequence(labels, batch_first=True, padding_value=0)
    return torch.stack(padded_images), padded_labels, label_lens

# 6. DataLoaders
train_dataset = IAMLineDataset('train')
val_dataset = IAMLineDataset('validation')
test_dataset = IAMLineDataset('test')

train_loader = DataLoader(train_dataset, batch_size=8, shuffle=True, collate_fn=collate_fn)
val_loader = DataLoader(val_dataset, batch_size=8, shuffle=False, collate_fn=collate_fn)
test_loader = DataLoader(test_dataset, batch_size=8, shuffle=False, collate_fn=collate_fn)

# 7. CRNN Model (CNN + RNN)
class CRNN(nn.Module):
    def __init__(self, vocab_size):
        super(CRNN, self).__init__()
        self.cnn = nn.Sequential(
            nn.Conv2d(1, 64, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
            nn.Conv2d(64, 128, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),
        )
        self.rnn = nn.LSTM(input_size=128 * 8, hidden_size=256, num_layers=2,
                           bidirectional=True, batch_first=True)
        self.fc = nn.Linear(512, vocab_size)

    def forward(self, x):
        x = self.cnn(x)
        b, c, h, w = x.size()
        x = x.permute(0, 3, 1, 2)
        x = x.view(b, w, c * h)
        x, _ = self.rnn(x)
        x = self.fc(x)
        x = x.log_softmax(2)
        return x

model = CRNN(vocab_size=vocab_size)

# 8. Loss and Optimizer
ctc_loss = nn.CTCLoss(blank=0)
optimizer = optim.Adam(model.parameters(), lr=1e-3)

# 9. Greedy CTC Decoder
def ctc_greedy_decoder(output, idx_to_char):
    pred_indices = torch.argmax(output, dim=1).cpu().numpy()
    decoded = []
    prev = -1
    for idx in pred_indices:
        if idx != prev and idx != 0:
            decoded.append(idx_to_char.get(idx, ''))
        prev = idx
    return ''.join(decoded)

# 10. Training Loop (quick test)
num_epochs = 2  # Increase for better results
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)

for epoch in range(num_epochs):
    model.train()
    total_loss = 0
    for batch_idx, (images, labels, label_lens) in enumerate(train_loader):
        images = images.to(device)
        labels = labels.to(device)
        optimizer.zero_grad()
        outputs = model(images)  # (batch, width, vocab_size)
        input_lengths = torch.full(size=(outputs.size(0),), fill_value=outputs.size(1), dtype=torch.long).to(device)
        targets = labels
        target_lengths = label_lens

        # Skip batch if input length < label length
        if outputs.size(1) < label_lens.max():
            print("Skipping batch: input length < label length")
            continue

        outputs = outputs.permute(1, 0, 2)  # (width, batch, vocab_size)
        loss = ctc_loss(outputs, targets, input_lengths, target_lengths)
        if torch.isnan(loss) or torch.isinf(loss):
            print("Skipping batch: loss is nan or inf")
            continue
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 5.0)
        optimizer.step()
        total_loss += loss.item()
        if batch_idx % 2 == 0:
            print(f"Epoch {epoch+1}, Batch {batch_idx}, Loss: {loss.item():.4f}")
    print(f"Epoch {epoch+1}, Avg Loss: {total_loss/len(train_loader):.4f}")

# 11. Save the trained model (optional)
torch.save(model.state_dict(), "crnn_iam.pth")

# 12. Inference Example (for a single image)
def preprocess_image(image_path):
    image = Image.open(image_path).convert("RGB")
    image = transform(image).unsqueeze(0)
    return image

# To skip training and just load a trained model, uncomment:
model.load_state_dict(torch.load("crnn_iam.pth", map_location=device))
model.eval()

def crnn_predict_text(image_bytes):
    from PIL import Image
    import io
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = transform(image).unsqueeze(0).to(device)
    model.eval()
    with torch.no_grad():
        logits = model(image)
        print("Logits shape:", logits.shape)
        logits = logits.squeeze(0)
        prediction = ctc_greedy_decoder(logits, idx_to_char)
        print("Decoded prediction:", prediction)
    return prediction