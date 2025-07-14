from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)
summarizer = pipeline("summarization")

@app.route('/summarize', methods=['POST'])
def summarize():
    data = request.json
    text = data['text']
    summary = summarizer(text, max_length=100, min_length=25, do_sample=False)
    return jsonify({'summary': summary[0]['summary_text']})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)