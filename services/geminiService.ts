import { GoogleGenAI } from "@google/genai";
import { Signal } from "../types";

// Helper to check if API key exists
export const hasApiKey = (): boolean => {
  return !!process.env.API_KEY;
};

// Initialize Gemini Client
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API_KEY not found in environment variables");
  return new GoogleGenAI({ apiKey });
};

export const analyzeSignalWithGemini = async (
  signal: Signal,
  onStream: (text: string) => void
): Promise<string> => {
  try {
    const ai = getClient();
    const model = "gemini-2.5-flash"; // Efficient for text analysis

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
      2. Identify potential macroeconomic catalysts (generic, based on instrument type).
      3. Verdict: Is this a "High Risk", "Medium Risk", or "Low Risk" trade setup?
      
      Format the output as a concise markdown summary. Do not include financial advice warnings, this is an internal system tool.
    `;

    const result = await ai.models.generateContentStream({
      model,
      contents: [{ parts: [{ text: prompt }] }],
    });

    let fullText = "";
    for await (const chunk of result) {
      if (chunk.text) {
        fullText += chunk.text;
        onStream(fullText);
      }
    }
    return fullText;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Failed to generate analysis. Please check API Key or connectivity.";
  }
};
