
import express, { Request, Response } from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini Client
// The API key is obtained exclusively from the server-side environment
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("CRITICAL: API_KEY missing in server environment");
}
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// Rate Limiting Logic
const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS = 20; // Max requests per IP per window
const ipRequests = new Map<string, number[]>();

const rateLimiter = (req: Request, res: Response, next: express.NextFunction) => {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  const timestamps = ipRequests.get(ip) || [];
  
  // Filter out timestamps older than the window
  const recent = timestamps.filter(t => now - t < WINDOW_MS);
  
  if (recent.length >= MAX_REQUESTS) {
    res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    return;
  }
  
  recent.push(now);
  ipRequests.set(ip, recent);
  next();
};

// Backend Validation Logic
// We duplicate core validation here to ensure the backend is self-reliant and secure
// regardless of client-side checks.
const validateSignal = (signal: any): { isValid: boolean; error?: string } => {
  if (!signal) return { isValid: false, error: 'Signal object is missing' };
  
  // Structural checks
  if (!signal.instrument || typeof signal.instrument !== 'string') {
    return { isValid: false, error: 'Invalid instrument format' };
  }
  
  // Injection defense
  const unsafePatterns = ['ignore previous instructions', 'system prompt', 'delete all', '<script>'];
  const metadataStr = JSON.stringify(signal.metadata || {}).toLowerCase();
  
  for (const pattern of unsafePatterns) {
    if (metadataStr.includes(pattern)) {
      return { isValid: false, error: 'Security violation: Potentially unsafe content detected' };
    }
  }
  
  return { isValid: true };
};

// Analysis Endpoint
app.post('/api/analyze', rateLimiter, async (req: Request, res: Response) => {
  const { signal } = req.body;

  // Security Validation
  const validation = validateSignal(signal);
  if (!validation.isValid) {
     res.status(400).json({ error: validation.error });
     return;
  }

  // Set headers for streaming response
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
     const model = "gemini-2.5-flash";
     const prompt = `
      You are a senior financial risk analyst for an algorithmic trading desk.
      Analyze the following trading signal and provide a concise risk assessment.
      
      Signal Details:
      - Instrument: ${signal.instrument}
      - Side: ${signal.side}
      - Entry Price: ${signal.price}
      - Stop Loss: ${signal.stop_loss}
      - Take Profit: ${signal.take_profit}
      - Source: ${signal.source}
      - Confidence: ${(signal.confidence * 100).toFixed(1)}%
      
      Tasks:
      1. Calculate the Reward-to-Risk Ratio.
      2. Identify potential macroeconomic catalysts (generic).
      3. Verdict: Is this a "High Risk", "Medium Risk", or "Low Risk" trade setup?
      
      Format the output as a concise markdown summary. Do not include financial advice warnings.
    `;

    // Stream content from Gemini
    const result = await ai.models.generateContentStream({
      model,
      contents: [{ parts: [{ text: prompt }] }],
    });

    for await (const chunk of result) {
      if (chunk.text) {
        res.write(chunk.text);
      }
    }
    res.end();

  } catch (error) {
    console.error('Server Analysis Error:', error);
    res.write('\n\n[System Error: Analysis Interrupted]');
    res.end();
  }
});

// Telegram Authentication Endpoint (Mock)
app.post('/api/telegram/request-code', rateLimiter, (req: Request, res: Response) => {
    const { app_id, app_hash, phone } = req.body;
    
    setTimeout(() => {
        if (!app_id || !app_hash || !phone) {
            res.status(400).json({ error: 'Missing credentials' });
            return;
        }
        res.json({ status: 'success', message: 'Code sent to device', phone_code_hash: 'mock_hash_123' });
    }, 1500);
});

app.post('/api/telegram/login', rateLimiter, (req: Request, res: Response) => {
    const { phone, code, phone_code_hash } = req.body;
    
    setTimeout(() => {
        if (code === '00000') { // Mock Failure
             res.status(401).json({ error: 'Invalid code' });
             return;
        }
        res.json({ 
            status: 'success', 
            session_id: 'mock_session_' + Date.now(),
            message: 'Authentication successful. Listening for signals.' 
        });
    }, 1500);
});

app.listen(PORT, () => {
  console.log(`NexusTrader Secure Backend running on port ${PORT}`);
});
