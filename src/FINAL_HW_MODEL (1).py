from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image
import torch

# Download and load the pre-trained TrOCR model and processor
processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-handwritten")
model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-handwritten")

# Load your image
image_path = r"C:\Users\lenovo\OneDrive\Documents\Desktop\PBL\Hello.jpg"
image = Image.open(image_path).convert("RGB")

# Preprocess and predict
pixel_values = processor(images=image, return_tensors="pt").pixel_values
generated_ids = model.generate(pixel_values)
predicted_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]

print("Predicted Text:", predicted_text)