import { SignalSide } from '../types';

export interface ParsedSignal {
  instrument?: string;
  side?: SignalSide;
  price?: number;
  stop_loss?: number;
  take_profit?: number;
  confidence?: number;
  raw_text?: string;
}

export const parseTelegramMessage = (text: string): ParsedSignal => {
  const cleanText = text.replace(/\*/g, '').trim(); // Remove bold formatting
  const upperText = cleanText.toUpperCase();
  const result: ParsedSignal = { raw_text: text };

  // 1. Detect Side
  if (upperText.match(/\bBUY\b/) || upperText.match(/\bLONG\b/)) result.side = 'BUY';
  else if (upperText.match(/\bSELL\b/) || upperText.match(/\bSHORT\b/)) result.side = 'SELL';

  // 2. Detect Instrument
  // Map common telegram aliases to standard pairs
  const commonPairs: Record<string, string> = {
    'GOLD': 'XAU/USD',
    'XAU': 'XAU/USD',
    'XAUUSD': 'XAU/USD',
    'BTC': 'BTC/USD',
    'BITCOIN': 'BTC/USD',
    'ETH': 'ETH/USD',
    'ETHEREUM': 'ETH/USD',
    'EURUSD': 'EUR/USD',
    'GBPUSD': 'GBP/USD',
    'US30': 'US30',
    'DJ30': 'US30',
    'NAS100': 'NAS100',
    'USTEC': 'NAS100',
    'GJ': 'GBP/JPY',
    'GBPJPY': 'GBP/JPY'
  };

  for (const [key, value] of Object.entries(commonPairs)) {
    // Word boundary check to avoid matching "GOLDEN" as "GOLD"
    const regex = new RegExp(`\\b${key}\\b`, 'i');
    if (regex.test(upperText)) {
      result.instrument = value;
      break;
    }
  }

  // Fallback: Look for pattern XXX/XXX or XXXXXX
  if (!result.instrument) {
    const pairMatch = upperText.match(/\b[A-Z]{3}\/?[A-Z]{3}\b/);
    if (pairMatch) {
        let pair = pairMatch[0];
        if (!pair.includes('/')) {
            pair = pair.slice(0, 3) + '/' + pair.slice(3);
        }
        result.instrument = pair;
    }
  }

  // 3. Extract Numbers with Context
  // Helper to extract value after a keyword
  const extractValue = (keywords: string[]): number | undefined => {
      const pattern = new RegExp(`(?:${keywords.join('|')})[\\s:=@]*([\\d.,]+)`, 'i');
      const match = text.match(pattern);
      if (match) {
          return parseFloat(match[1].replace(',', ''));
      }
      return undefined;
  };

  result.stop_loss = extractValue(['SL', 'STOP', 'STOP LOSS', 'STOPLOSS']);
  result.take_profit = extractValue(['TP', 'TARGET', 'TAKE PROFIT', 'TAKEPROFIT']);
  
  // Entry is tricky. It's often "@ 1234" or just "1234" near the signal
  // Try explicit entry keywords first
  result.price = extractValue(['@', 'AT', 'ENTRY', 'PRICE', 'OPEN']);

  // If explicit entry failed, try to infer from context (number nearest to instrument/side)
  if (!result.price && result.side) {
      // Find all numbers
      const allNumbers = text.match(/[\d.,]+/g);
      if (allNumbers) {
          const candidates = allNumbers.map(n => parseFloat(n.replace(',', ''))).filter(n => 
              n !== result.stop_loss && 
              n !== result.take_profit &&
              !isNaN(n)
          );
          // Heuristic: If we have candidates, take the first one that looks like a price
          if (candidates.length > 0) result.price = candidates[0];
      }
  }

  // 4. Calculate Confidence based on completeness
  let score = 0;
  if (result.instrument) score += 0.4;
  if (result.side) score += 0.3;
  if (result.price) score += 0.1;
  if (result.stop_loss) score += 0.1;
  if (result.take_profit) score += 0.1;
  
  result.confidence = parseFloat(score.toFixed(2));

  return result;
};