import "server-only";
import mammoth from "mammoth";

/** Pulls plain text out of a PDF, Word document or text file. */
export async function extractResumeText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  const buffer = Buffer.from(await file.arrayBuffer());

  if (name.endsWith(".pdf")) {
    // unpdf ships a serverless build of pdf.js, so this works on Vercel functions.
    const { extractText, getDocumentProxy } = await import("unpdf");
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });
    return Array.isArray(text) ? text.join("\n") : text;
  }

  if (name.endsWith(".docx")) {
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  }

  if (name.endsWith(".txt") || name.endsWith(".md")) {
    return buffer.toString("utf8");
  }

  throw new Error("Upload a PDF, Word (.docx), or text file.");
}

/** Collapses the whitespace soup that PDF extraction usually produces. */
export function tidyResumeText(raw: string): string {
  return raw
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 24000);
}
