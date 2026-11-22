import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildPrompt } from '../config/rubricPrompt.js';
import { runLocalAudit } from '../utils/localAuditEngine.js';

export default async function analyzeController(req, res) {
  const { resumeText, jdText } = req.body || {};

  // 1. Validate inputs (NEVER log the actual text content)
  if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 20) {
    return res.status(400).json({ error: 'Please provide resume text (at least 20 characters).' });
  }
  if (!jdText || typeof jdText !== 'string' || jdText.trim().length < 20) {
    return res.status(400).json({ error: 'Please provide job description text (at least 20 characters).' });
  }

  // 2. Resolve API key
  const apiKey = req.headers['x-gemini-api-key']?.trim() || process.env.GEMINI_API_KEY?.trim();

  // 3. If an API key is provided, try Gemini 3.8 / 1.5 Flash
  if (apiKey) {
    try {
      const prompt = buildPrompt(resumeText.trim(), jdText.trim());
      const genAI = new GoogleGenerativeAI(apiKey);

      const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-1.5-flash'];
      let rawText = null;

      for (const modelName of CANDIDATE_MODELS) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 8192,
              responseMimeType: 'application/json',
            },
          });
          const result = await model.generateContent(prompt);
          rawText = result.response.text();
          if (rawText) break;
        } catch (mErr) {
          if (mErr.message?.includes('404') || mErr.message?.includes('no longer available')) {
            continue;
          }
          break; // Stop loop on auth or other errors
        }
      }

      if (rawText) {
        const parsed = JSON.parse(rawText);
        if (
          typeof parsed.overall_score === 'number' &&
          Array.isArray(parsed.pillars) &&
          Array.isArray(parsed.skill_matrix) &&
          Array.isArray(parsed.bullet_rewrites) &&
          Array.isArray(parsed.action_plan)
        ) {
          return res.json(parsed);
        }
      }
    } catch (apiErr) {
      console.warn('[analyzeController] Gemini API unavailable or key invalid. Falling back to built-in local engine:', apiErr.message);
    }
  }

  // 4. Default / Fallback: Instant, evidence-grounded local rubric engine
  // Analyzes the real resumeText and jdText submitted by the user
  console.log('[analyzeController] Running local evidence-grounded audit engine...');
  const localResult = runLocalAudit(resumeText.trim(), jdText.trim());
  return res.json(localResult);
}
