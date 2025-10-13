import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import pdfWorker from "pdfjs-dist/legacy/build/pdf.worker?url";

// configure pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
/**
 * Extract structured data (rows & columns) from a PDF
 * based on spacing between words.
 */
export async function extractTableFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const allRows = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const rawText = textContent.items.map((item) => item.str).join(" ");
    const lines = rawText.split(/\n|(?<=\d)\s{2,}|(?<=:)\s/).map((line) => line.trim()).filter(Boolean);
    const rows = lines.map((line) => line.split(/\s{2,}|\t+/).map((c) => c.trim()));
    allRows.push(...rows);
  }

  return allRows;
}