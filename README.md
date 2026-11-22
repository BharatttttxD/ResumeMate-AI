# ResumeMate AI

Privacy-first, evidence-grounded resume alignment tool powered by Google Gemini 2.0 Flash.

## Quick Start

```bash
npm run install:all
npm run dev
```

Open http://localhost:5173 and paste your Gemini API key in the top-right **API Key** button.

## Architecture
- **Frontend**: React 18 + Vite + Tailwind CSS v3 (port 5173)
- **Backend**: Node.js + Express ESM (port 5000)
- **AI**: Google Gemini 2.0 Flash

## Privacy
- Resume text is PII-redacted client-side before leaving the browser
- PDFs are parsed client-side via pdfjs-dist (never uploaded)
- Server is stateless — zero database, zero disk writes
