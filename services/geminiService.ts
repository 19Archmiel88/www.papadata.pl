import { GoogleGenAI } from "@google/genai";

// Initialize the client
// NOTE: In a real deployment, ensure process.env.API_KEY is set.
const apiKey = process.env.API_KEY || 'DUMMY_KEY_FOR_DEMO_ONLY_DO_NOT_USE_IN_PROD'; 
const ai = new GoogleGenAI({ apiKey });

export interface AnalyzerResult {
  summary: string;
  insights: string[];
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  confidence: number;
  recommendation?: string;
}

export const getDashboardInsights = async (metrics: any): Promise<AnalyzerResult> => {
  try {
    // Using Flash for fast dashboard insights
    const modelId = 'gemini-2.5-flash';
    
    const prompt = `
      You are a data analyst for PapaData. Analyze the following JSON metrics for an e-commerce client.
      Return a JSON object (and ONLY a JSON object) with the following structure:
      {
        "summary": "One sentence summary of performance",
        "insights": ["Key finding 1", "Key finding 2", "Key finding 3"],
        "sentiment": "Positive" | "Neutral" | "Negative",
        "confidence": number (0-100 integer),
        "recommendation": "One specific action to take"
      }
      
      Metrics: ${JSON.stringify(metrics)}
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");

    return JSON.parse(text) as AnalyzerResult;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return {
      summary: "Unable to generate insights at this time.",
      insights: ["Check data connection", "Retry analysis"],
      sentiment: "Neutral",
      confidence: 0,
      recommendation: "Please check your internet connection and try again."
    };
  }
};

export const generateDashboardImage = async (prompt: string): Promise<string | null> => {
  try {
    const modelId = 'gemini-2.5-flash-image';
    
    const finalPrompt = `
      Create a high-quality, futuristic UI design or data visualization for a platform called "PapaData". 
      Context: ${prompt}. 
      Style: Dark mode, neon cyan and blue accents, professional enterprise dashboard, highly detailed charts.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [{ text: finalPrompt }],
      },
      // Note: responseMimeType is not supported for image generation models
    });

    // Iterate through parts to find the image
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    return null;
  }
};

export const chatWithPapaBot = async (history: {role: 'user' | 'model', parts: {text: string}[]}[], message: string) => {
  try {
    // Using Pro for complex reasoning in chat
    const modelId = 'gemini-3-pro-preview';
    
    const chat = ai.chats.create({
      model: modelId,
      history: history,
      config: {
        systemInstruction: "You are PapaBot, the helpful AI assistant for the PapaData platform. You help users configure ETLs, understand their data, and fix integration issues. Be concise, technical but friendly.",
      }
    });

    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm having trouble connecting to the data core. Please try again later.";
  }
};