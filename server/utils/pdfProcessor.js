const fs = require('fs');
const pdfParse = require('pdf-parse');

async function extractTextFromPdf(filePath) {
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);

  const MAX_CHARS = 15000; // ~5000 tokens
  const truncated = data.text.length > MAX_CHARS ? data.text.slice(0, MAX_CHARS) : data.text;

  return truncated;
}
module.exports = { extractTextFromPDF };
