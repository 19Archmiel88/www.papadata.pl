export interface AnalyzerResult {
  summary: string;
  insights: string[];
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  confidence: number;
  recommendation?: string;
}

/**
 * Request dashboard insights from the backend AI service.
 * The front‑end no longer communicates directly with Gemini. Instead it
 * forwards all analytic requests to the BFF (`/api/ai/ask`). The backend
 * performs the call using server‑side credentials and returns a safe
 * response. Should the call fail or return an invalid payload, a
 * conservative fallback is returned so the UI can continue to function.
 */
export const getDashboardInsights = async (metrics: any): Promise<AnalyzerResult> => {
  try {
    const response = await fetch('/api/ai/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ metrics })
    });
    if (!response.ok) throw new Error('Bad response');
    return (await response.json()) as AnalyzerResult;
  } catch (error) {
    console.error('AI Insight Error:', error);
    return {
      summary: 'Unable to generate insights at this time.',
      insights: ['Check data connection', 'Retry analysis'],
      sentiment: 'Neutral',
      confidence: 0,
      recommendation: 'Please check your network connection and try again.'
    };
  }
};

/**
 * Proxy chat requests through the BFF. Accepts a history of prior messages
 * and the latest message from the user. Returns only the assistant’s reply
 * as plain text. If the call fails the fallback message will be
 * presented.
 */
export const chatWithPapaBot = async (
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  message: string
): Promise<string> => {
  try {
    const response = await fetch('/api/ai/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history, message })
    });
    if (!response.ok) throw new Error('Bad response');
    const data = await response.json();
    return data?.answer ?? '';
  } catch (error) {
    console.error('AI Chat Error:', error);
    return "I'm having trouble connecting to the data core. Please try again later.";
  }
};

/**
 * Image generation is disabled on the client. All image generation tasks
 * should be performed via backend services. Returning null here avoids
 * bundling AI logic or exposing any secrets.
 */
export const generateDashboardImage = async (_prompt: string): Promise<string | null> => {
  return null;
};