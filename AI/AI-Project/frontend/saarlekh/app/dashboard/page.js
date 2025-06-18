"use client";
import { useState } from "react";

export default function Dashboard() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSummarize() {
    setLoading(true);
    setSummary("");
    const res = await fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await res.json();
    setSummary(data.summary || data.error || "No summary.");
    setLoading(false);
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Text Summarizer</h1>
      <textarea
        rows={10}
        cols={60}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste your paragraph or essay here..."
        style={{ width: "100%", marginBottom: "1rem" }}
      />
      <br />
      <button onClick={handleSummarize} disabled={loading || !text}>
        {loading ? "Summarizing..." : "Summarize"}
      </button>
      <div style={{ marginTop: "2rem" }}>
        {summary && (
          <div>
            <strong>Summary:</strong>
            <p>{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}