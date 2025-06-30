const fs = require('fs');
const pdfParse = require('pdf-parse');

async function extractTextFromPDF(fileBuffer) {
  try {
    const data = await pdfParse(fileBuffer);
    return data.text;
  } catch (err) {
    throw new Error('PDF parsing failed');
  }
}

module.exports = { extractTextFromPDF };
