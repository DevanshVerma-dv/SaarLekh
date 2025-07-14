import easyocr
import cv2
import matplotlib.pyplot as plt

# Load image path
image_path = "C:/Users/lenovo/OneDrive/Documents/Desktop/PBL/input.png"  # Update path accordingly

# Initialize the EasyOCR reader
reader = easyocr.Reader(['en'])  # supports multiple languages too

# Read the image
results = reader.readtext(image_path)

# Display the image and predictions
image = cv2.imread(image_path)
for (bbox, text, prob) in results:
    (top_left, top_right, bottom_right, bottom_left) = bbox
    top_left = tuple(map(int, top_left))
    bottom_right = tuple(map(int, bottom_right))

    cv2.rectangle(image, top_left, bottom_right, (0, 255, 0), 2)
    cv2.putText(image, text, (top_left[0], top_left[1] - 10), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 0, 0), 2)

# Convert BGR to RGB for displaying
plt.figure(figsize=(10, 10))
plt.imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
plt.axis('off')
plt.title("Detected Text")
plt.show()

# Print extracted text only
print("📜 Extracted Text:")
for (_, text, _) in results:
    print(text)