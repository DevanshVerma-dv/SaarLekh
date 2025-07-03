import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "SaarLekh - AI Document Processing Agent",
  description: "AI-powered document processing with OCR, summarization, and question generation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Toaster />
        {children}
      </body>
    </html>
  );
}
