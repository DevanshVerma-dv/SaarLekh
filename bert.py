from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import re

def sbert_summary(text, num_sentences=3):
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    if len(sentences) <= num_sentences:
        return ' '.join(sentences)
    model = SentenceTransformer('all-MiniLM-L6-v2')
    embeddings = model.encode(sentences)
    doc_embedding = np.mean(embeddings, axis=0)
    similarities = cosine_similarity([doc_embedding], embeddings)[0]
    top_idx = similarities.argsort()[-num_sentences:]
    top_idx.sort()
    summary = ' '.join([sentences[i] for i in top_idx])
    return summary

if __name__ == "__main__":
    text = """
    Sentence embeddings with BERT are useful for many NLP tasks.
    They capture the semantic meaning of sentences in a dense vector.
    Extractive summarization selects the most relevant sentences from the text.
    This is different from abstractive summarization, which generates new sentences.
    Using cosine similarity, we can pick sentences closest to the overall meaning.
    """
    print(sbert_summary(text, num_sentences=2))