import { NextResponse } from 'next/server';

export async function GET() {
    const agentInfo = {
        name: "SaarLekh AI Agent",
        type: "Document Processing Agent",
        capabilities: [
            "Optical Character Recognition (OCR)",
            "Text Summarization",
            "Question Generation",
            "Document Analysis",
            "Image to Text Conversion"
        ],
        description: "I am SaarLekh, an AI agent specialized in document and image processing. I can extract text from images, generate summaries, and create questions from content.",
        version: "1.0.0",
        status: "active"
    };

    return NextResponse.json(agentInfo);
}

export async function POST(request) {
    try {
        const { query } = await request.json();
        
        if (!query) {
            return NextResponse.json({ error: 'Query is required' }, { status: 400 });
        }

        // Handle the specific question "currently you are which agent?"
        if (query.toLowerCase().includes('which agent') || 
            query.toLowerCase().includes('what agent') ||
            query.toLowerCase().includes('who are you')) {
            
            const response = {
                question: query,
                answer: "I am SaarLekh, an AI document processing agent. My primary capabilities include extracting text from images through OCR, generating summaries of content, and creating questions from text. I specialize in document analysis and can help you convert images to text, summarize content, and generate educational questions.",
                agentType: "Document Processing Agent",
                capabilities: [
                    "Optical Character Recognition (OCR)",
                    "Text Summarization", 
                    "Question Generation",
                    "Document Analysis"
                ]
            };
            
            return NextResponse.json(response);
        }

        // For other queries, return a general response
        return NextResponse.json({
            question: query,
            answer: "I am SaarLekh AI Agent. I can help you with document processing tasks. Please upload an image or ask me about my capabilities.",
            suggestion: "Try asking 'what can you do?' or upload an image to get started."
        });

    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}