
import { Signal } from '../types';
import { logger } from './logger';

// --- Rate Limiting ---
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;
let requestTimestamps: number[] = [];

export const checkRateLimit = (): boolean => {
  const now = Date.now();
  // Filter out timestamps older than the window
  requestTimestamps = requestTimestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
  
  if (requestTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    logger.warn('Rate limit exceeded', { count: requestTimestamps.length });
    return false;
  }
  
  requestTimestamps.push(now);
  return true;
};

// --- Input Validation & Sanitization ---

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateSignal = (signal: Signal): ValidationResult => {
  if (!signal) {
    return { isValid: false, error: 'Signal object is missing' };
  }

  // 1. Structural Validation
  if (!signal.instrument || typeof signal.instrument !== 'string') {
    return { isValid: false, error: 'Invalid instrument format' };
  }
  
  // Basic alphanumeric + symbols check for instruments (e.g., XAU/USD, BTC-USD)
  if (!/^[A-Z0-9\/\-\.]+$/.test(signal.instrument)) {
    return { isValid: false, error: 'Malformatted instrument identifier' };
  }

  // 2. Logic Validation
  if (signal.price < 0 || signal.stop_loss < 0 || signal.take_profit < 0) {
    return { isValid: false, error: 'Price values cannot be negative' };
  }

  // 3. Sanitization / Prompt Injection Defense
  // Check metadata for common injection patterns
  const unsafePatterns = [
    'ignore previous instructions',
    'system prompt',
    'delete all',
    'drop table',
    '<script>'
  ];
  
  const metadataStr = JSON.stringify(signal.metadata || {}).toLowerCase();
  for (const pattern of unsafePatterns) {
    if (metadataStr.includes(pattern)) {
      logger.warn('Potential prompt injection detected', { signalId: signal.id });
      return { isValid: false, error: 'Security policy violation: Unsafe content detected' };
    }
  }

  return { isValid: true };
};
