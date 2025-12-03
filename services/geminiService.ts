import { Signal } from "../types";
import { logger } from "./logger";

// Configuration for Backend Endpoint
// In production, this URL would be determined by environment variables
const BACKEND_URL = 'http://localhost:3001/api/analyze';

// Helper to check if system is ready (Backend assumed available)
export const hasApiKey = (): boolean => {
  return true; 
};

export const analyzeSignalWithGemini = async (
  signal: Signal,
  onStream: (text: string) => void
): Promise<string> => {
  
  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ signal }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return "Analysis paused: Global rate limit exceeded. Please wait a moment.";
      }
      throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error("No response body received from server");
    }

    // Process the stream from the backend
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;
      onStream(fullText);
    }

    return fullText;

  } catch (error) {
    logger.error("Analysis Request Failed", error);
    return "Connection Error: Unable to reach analysis server. Please ensure the backend is running on port 3001.";
  }
};