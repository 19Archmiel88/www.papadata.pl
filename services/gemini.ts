import { GoogleGenAI, Type } from '@google/genai';
import { DashboardData, AIAnalysisResult } from '../types';

const envKey = import.meta.env?.VITE_GEMINI_API_KEY;
const processKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;
const apiKey = envKey || processKey;

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const ANALYSIS_MODEL = 'gemini-2.5-flash';
const CHAT_MODEL = 'gemini-2.5-flash';

const createFallbackAnalysis = (data: DashboardData): AIAnalysisResult => ({
  summary: `Unable to reach Gemini, but revenue is ${data.revenue.toLocaleString()} in ${data.period}.`,
  positiveTrends: [
    `Revenue ${data.revenue.toLocaleString()}`,
    `ROAS ${data.roas.toFixed(2)}`,
    `Conversion ${data.conversionRate.toFixed(1)}%`,
  ],
  areasForImprovement: [
    'API connectivity (Gemini not initialized)',
    `Conversion ${data.conversionRate.toFixed(1)}%`,
    'Real-time sync',
  ],
  strategicRecommendation: 'Ensure a valid Gemini API key is configured and the environment can reach the GenAI endpoint.',
});

const createOfflineStream = async function* (message: string, data: DashboardData) {
  yield {
    text: `Gemini offline response: ${message}. Revenue ${data.revenue.toLocaleString()}, ROAS ${data.roas.toFixed(
      2,
    )}, margin ${data.margin.toFixed(0)}%.`,
  };
};

const createOfflineChatSession = (data: DashboardData) => ({
  sendMessageStream: async (message: string) => createOfflineStream(message, data),
});

/**
 * Generates a structured analysis of the provided dashboard data.
 */
export const generateDashboardAnalysis = async (data: DashboardData): Promise<AIAnalysisResult> => {
  if (!ai) {
    return createFallbackAnalysis(data);
  }

  const prompt = `
    You are a senior data analyst for a high-growth e-commerce brand.
    Analyze the following dashboard data and provide a strategic executive summary.

    Data:
    ${JSON.stringify(data, null, 2)}

    Focus on Revenue, ROAS (Revenue/Spend), and Conversion trends.
    Be concise, professional, and insightful.
  `;

  try {
    const response = await ai.models.generateContent({
      model: ANALYSIS_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: 'A 2-3 sentence executive summary of performance.',
            },
            positiveTrends: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 key positive performance indicators.',
            },
            areasForImprovement: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 areas that need attention or optimization.',
            },
            strategicRecommendation: {
              type: Type.STRING,
              description: 'One key strategic action to take immediately.',
            },
          },
          required: [
            'summary',
            'positiveTrends',
            'areasForImprovement',
            'strategicRecommendation',
          ],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAnalysisResult;
    }

    return createFallbackAnalysis(data);
  } catch (error) {
    console.error('Gemini Analysis Error:', error);
    return createFallbackAnalysis(data);
  }
};

/**
 * Creates a chat session for follow-up questions about the data.
 */
export const createDataChat = (data: DashboardData) => {
  if (!ai) {
    return createOfflineChatSession(data);
  }

  return ai.chats.create({
    model: CHAT_MODEL,
    config: {
      systemInstruction: `You are Nexus AI, a helpful data assistant.
      You have access to the current dashboard data: ${JSON.stringify(data)}.
      Answer questions specifically about this data. Keep answers brief (under 50 words) unless asked for detail.`,
    },
  });
};
