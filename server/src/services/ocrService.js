const Tesseract = require('tesseract.js');

async function extractTextFromImage(buffer) {
  try {
    const { data } = await Tesseract.recognize(buffer, 'eng', {
      logger: () => {},
    });

    return (data.text || '').trim();
  } catch (error) {
    error.message = 'Unable to extract text from image. Try a clearer scan or different format.';
    throw error;
  }
}

module.exports = {
  extractTextFromImage,
};
