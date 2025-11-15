const express = require('express');
const multer = require('multer');

const { extractTextFromPdf } = require('../services/pdfParser');
const { extractTextFromImage } = require('../services/ocrService');
const { buildSuggestionSummary } = require('../utils/suggestions');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024, files: 5 },
});

const SUPPORTED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

async function processFile(file) {
  const { buffer, mimetype, originalname } = file;

  if (mimetype === 'application/pdf') {
    const text = await extractTextFromPdf(buffer);
    return { filename: originalname, type: 'pdf', text };
  }

  if (SUPPORTED_IMAGE_TYPES.includes(mimetype)) {
    const text = await extractTextFromImage(buffer);
    return { filename: originalname, type: 'image', text };
  }

  const error = new Error(`Unsupported file type for ${originalname}. Upload PDF or image files.`);
  error.status = 400;
  throw error;
}

router.post('/', upload.array('files', 5), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Upload at least one PDF or image file.' });
    }

  const processedFiles = await Promise.all(req.files.map(processFile));
  const combinedText = processedFiles.map((file) => file.text).join('\n\n');
    const suggestions = buildSuggestionSummary(combinedText);

    res.json({
      files: processedFiles,
      extractedText: combinedText,
      suggestions,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
