import easyocr
from PIL import Image
import io
import numpy as np  # Add this import

reader = easyocr.Reader(['en'])

def easyocr_extract_text(image_bytes):
    image = Image.open(io.BytesIO(image_bytes))
    image_np = np.array(image)  # Convert PIL image to numpy array
    results = reader.readtext(image_np)
    extracted_text = " ".join([text for (_, text, _) in results])
    return extracted_text