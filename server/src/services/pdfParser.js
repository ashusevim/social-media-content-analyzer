const { PDFParse } = require('pdf-parse');

async function extractTextFromPdf(buffer) {
  let parser;

  try {
    parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return (result.text || '').trim();
  } catch (error) {
    error.message = 'Unable to read PDF. Ensure the file is not encrypted or corrupted.';
    throw error;
  } finally {
    if (parser) {
      try {
        await parser.destroy();
      } catch (_) {
        // Best-effort cleanup; suppress secondary errors.
      }
    }
  }
}

module.exports = {
  extractTextFromPdf,
};
