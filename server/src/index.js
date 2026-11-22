import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';
import cors from 'cors';
import rateLimiter from './middleware/rateLimiter.js';
import analyzeController from './controllers/analyzeController.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../../.env') });

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));

app.use(express.json({ limit: '2mb' }));
app.use(rateLimiter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0', model: 'gemini-2.0-flash', timestamp: new Date().toISOString() });
});

app.post('/api/analyze', analyzeController);

// Global error handler — never logs req.body
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`ResumeMate API server running on port ${PORT}`);
});
