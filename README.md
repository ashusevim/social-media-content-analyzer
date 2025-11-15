# Social Media Content Analyzer

Full-stack tool that ingests PDF decks or scanned screenshots, extracts the underlying copy with OCR, and returns engagement-ready insights.

## Highlights

- **Document uploads** – Drag-and-drop up to five PDFs or images per run; files never touch disk thanks to Multer’s in-memory storage.
- **Text extraction** – Uses `pdf-parse` for native PDFs and `tesseract.js` for OCR on images/web captures.
- **Engagement guidance** – Basic NLP heuristics surface metrics such as word count, hashtags, mentions, emojis, estimated reading time, plus prioritized suggestions.
- **Modern UI** – Vite + React dashboard with live status, queue management, and extracted text preview.

## Stack

- Frontend: React 19 + TypeScript (Vite)
- Backend: Node.js + Express 5, Multer, pdf-parse, tesseract.js
- Tooling: npm workspaces, concurrently, Nodemon

## Getting Started

> Requires Node.js 18+ (or any version supported by Vite 7 / Express 5) and npm.

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure environment variables** (optional)
   ```bash
   cp server/.env.example server/.env
   cp client/.env.example client/.env
   ```
   - `server/.env`: tweak `PORT` if 5001 conflicts.
   - `client/.env`: update `VITE_API_URL` if the API runs elsewhere.
3. **Run the full stack**
   ```bash
   npm run dev
   ```
   - API: <http://localhost:5001>
   - Web: <http://localhost:5173>
4. **Individual targets**
   ```bash
   npm run dev:server   # Express + Nodemon
   npm run dev:client   # Vite dev server
   npm run build        # Production build (client)
   ```

## API Overview

`POST /api/analyze`

- **Body**: `multipart/form-data` with `files` field (multiple allowed).
- **Limits**: 5 files, 15 MB each. Supported types: PDF, PNG, JPG, JPEG, WEBP.
- **Response**:
  ```json
  {
    "files": [
      { "filename": "deck.pdf", "type": "pdf", "text": "..." }
    ],
    "extractedText": "Combined text",
    "suggestions": {
      "metrics": {
        "wordCount": 123,
        "hashtagCount": 2,
        "mentionCount": 1,
        "emojiCount": 0,
        "readingTime": 0.68,
        "avgSentenceLength": 18
      },
      "suggestions": [
        { "title": "Add hashtags", "detail": "...", "priority": "medium" }
      ]
    }
  }
  ```

## Project Structure

```
.
├── client/               # React frontend (Vite)
├── server/               # Express API with OCR/PDF services
├── package.json          # npm workspaces + shared scripts
└── README.md
```

## Next Steps

- Persist analysis history per user session
- Add tone classification + sentiment scoring
- Export suggestions as PDF/CSV for campaign briefs

Feel free to extend the heuristics or wire up a database if you need persistent analytics.
