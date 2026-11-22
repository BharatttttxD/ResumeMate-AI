/**
 * Client-side PII redaction utility.
 * Masks emails, phone numbers, URLs, and postal codes before any data leaves the browser.
 */

/**
 * Redacts PII from the given text.
 * @param {string} text
 * @returns {{ redactedText: string, count: number, details: Array<{type: string, original: string, replacement: string}> }}
 */
export function redactPII(text) {
  if (!text || typeof text !== 'string') {
    return { redactedText: text || '', count: 0, details: [] };
  }

  const details = [];
  let result = text;

  // 1. Email addresses
  const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
  result = result.replace(emailRegex, (match) => {
    details.push({ type: 'EMAIL', original: match, replacement: '[EMAIL_REDACTED]' });
    return '[EMAIL_REDACTED]';
  });

  // 2. Phone numbers — US formats (+1, dashes, dots, parentheses) and international
  const phoneRegex = /(\+?1[\s.\-]?)?\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4}/g;
  result = result.replace(phoneRegex, (match) => {
    details.push({ type: 'PHONE', original: match, replacement: '[PHONE_REDACTED]' });
    return '[PHONE_REDACTED]';
  });

  // 3. URLs — http/https, www, github.com, linkedin.com, etc.
  const urlRegex = /((https?:\/\/)|(www\.))[^\s"'<>]+/gi;
  result = result.replace(urlRegex, (match) => {
    details.push({ type: 'URL', original: match, replacement: '[URL_REDACTED]' });
    return '[URL_REDACTED]';
  });

  // 4. US ZIP codes (5-digit or ZIP+4) and Canadian postal codes
  const postalRegex = /\b([A-Z][0-9][A-Z]\s?[0-9][A-Z][0-9]|\d{5}(?:-\d{4})?)\b/g;
  result = result.replace(postalRegex, (match) => {
    // Skip pure years (e.g. 2024) and port numbers
    const asNum = parseInt(match.replace(/\D/g, ''), 10);
    if (!isNaN(asNum) && asNum >= 1900 && asNum <= 2100 && match.length === 4) return match;
    details.push({ type: 'LOCATION', original: match, replacement: '[LOCATION_REDACTED]' });
    return '[LOCATION_REDACTED]';
  });

  return { redactedText: result, count: details.length, details };
}

/**
 * Returns just the count of PII items found in the text.
 * @param {string} text
 * @returns {number}
 */
export function countPIIItems(text) {
  return redactPII(text).count;
}
