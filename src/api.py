from fastapi import FastAPI, Request, UploadFile, File
from pydantic import BaseModel
from main import generate_questions
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
import io
from bert import sbert_summary
from Easy_model import easyocr_extract_text
from trocr_hw import trocr_handwritten_extract_text
from HW_MODEL import crnn_predict_text

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

processor = TrOCRProcessor.from_pretrained("microsoft/trocr-large-handwritten")
trocr_model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-large-handwritten")

class Passage(BaseModel):
    text: str

@app.post("/generate-questions")
def get_questions(passage: Passage):
    questions = generate_questions(passage.text)
    return {"questions": questions}

@app.post("/image-to-summary")
async def image_to_summary(file: UploadFile = File(...)):
    image_bytes = await file.read()
    extracted_text = crnn_predict_text(image_bytes)
    summary = sbert_summary(extracted_text, num_sentences=3)
    return {"summary": summary}

@app.post("/image-to-text")
async def image_to_text(file: UploadFile = File(...)):
    image_bytes = await file.read()
    predicted_text = crnn_predict_text(image_bytes)
    print("OCR Output:", predicted_text)
    return {"text": predicted_text}