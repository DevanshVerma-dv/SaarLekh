import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const { text } = body;
  if (!text) return NextResponse.json({ error: "No text provided" }, { status: 400 });

  const response = await fetch("http://localhost:5000/summarize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  const data = await response.json();
  return NextResponse.json({ summary: data.summary });
}