const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
const upload = multer({ dest: "uploads/" });
app.use(cors());

app.post("/api/summarize", upload.single("image"), async (req, res) => {
  try {
    // 1. OCR: Extract text from image
    const imagePath = req.file.path;
    const ocrResult = await Tesseract.recognize(imagePath, "eng");
    const extractedText = ocrResult.data.text;

    // 2. Summarize: Send text to BERT model API
    const bertResponse = await fetch("http://localhost:5000/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: extractedText }),
    });
    const summaryData = await bertResponse.json();

    // 3. Respond to frontend
    res.json({ summary: summaryData.summary });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});