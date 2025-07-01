const pdfParse = require('pdf-parse');

async function extractTextFromPDF(fileBuffer) {
  const data = await pdfParse(fileBuffer);

  const MAX_CHARS = 15000; // ~5000 tokens
  const truncated = data.text.length > MAX_CHARS ? data.text.slice(0, MAX_CHARS) : data.text;

  return truncated;
}

module.exports = { extractTextFromPDF };
