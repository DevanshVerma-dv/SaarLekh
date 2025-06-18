from flask import Flask, request, jsonify
from flask_cors import CORS
import easyocr
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)

@app.route('/ocr', methods=['POST'])
def ocr():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    file = request.files['image']
    image_bytes = file.read()
    npimg = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
    reader = easyocr.Reader(['en'])
    results = reader.readtext(image)
    extracted_text = "\n".join([text for (_, text, _) in results])
    return jsonify({'text': extracted_text})