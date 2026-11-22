import * as pdfjsLib from 'pdfjs-dist';

// Use CDN worker to avoid Vite worker bundling complications
pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.6.82/pdf.worker.min.mjs';

/**
 * Extracts plain text from a PDF File object using pdfjs-dist.
 * Runs entirely in the browser — the file is never uploaded to any server.
 *
 * @param {File} file - A File object from an <input type="file"> or drag-drop event
 * @returns {Promise<string>} - Full extracted text from all pages
 */
export async function extractTextFromPDF(file) {
  if (!file) throw new Error('No file provided.');
  if (file.type !== 'application/pdf') throw new Error('Only PDF files are supported.');

  let arrayBuffer;
  try {
    arrayBuffer = await file.arrayBuffer();
  } catch (err) {
    throw new Error(`Could not read file: ${err.message}`);
  }

  let pdf;
  try {
    pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  } catch (err) {
    throw new Error(`Failed to load PDF: ${err.message}`);
  }

  const pageTexts = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    const pageText = textContent.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (pageText) pageTexts.push(pageText);
  }

  if (pageTexts.length === 0) {
    throw new Error(
      'No text could be extracted. The PDF may be image-based or encrypted. Try copying the text manually.'
    );
  }

  return pageTexts.join('\n\n');
}
