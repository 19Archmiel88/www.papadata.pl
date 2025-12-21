import { chunkText, createSseParser, streamChunks } from '../../utils/stream';
import type { ChatMessage } from './tokenBudget';

type GeminiStreamOptions = {
  apiKey: string;
  messages: ChatMessage[];
  systemPrompt?: string;
  signal?: AbortSignal;
  onChunk: (chunk: string) => void;
};

export type GeminiStreamResult = {
  text: string;
  finishReason?: string;
  blocked?: boolean;
};

const MODEL_ID = 'gemini-1.5-flash';
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const buildPayload = (messages: ChatMessage[], systemPrompt?: string) => {
  const contents = messages
    .filter((message) => message.role !== 'system' && message.content.trim())
    .map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content }],
    }));

  return {
    contents,
    ...(systemPrompt
      ? {
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
        }
      : {}),
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 768,
    },
  };
};

const parsePayload = (payload: any) => {
  const candidate = payload?.candidates?.[0];
  const parts = candidate?.content?.parts ?? [];
  const text = parts.map((part: { text?: string }) => part.text ?? '').join('');
  const finishReason = candidate?.finishReason;
  const blocked =
    Boolean(payload?.promptFeedback?.blockReason) ||
    finishReason === 'SAFETY' ||
    finishReason === 'BLOCKED';
  return { text, finishReason, blocked };
};

const simulateStreaming = async (
  payload: any,
  onChunk: (chunk: string) => void,
  signal?: AbortSignal,
) => {
  const { text, finishReason, blocked } = parsePayload(payload);
  if (blocked) {
    return { text: '', finishReason, blocked };
  }
  const chunks = chunkText(text, 24);
  await streamChunks(chunks, onChunk, signal, 18);
  return { text, finishReason, blocked };
};

export const streamGeminiResponse = async ({
  apiKey,
  messages,
  systemPrompt,
  signal,
  onChunk,
}: GeminiStreamOptions): Promise<GeminiStreamResult> => {
  const payload = buildPayload(messages, systemPrompt);
  const streamUrl = `${API_BASE}/${MODEL_ID}:streamGenerateContent?alt=sse&key=${apiKey}`;
  const fallbackUrl = `${API_BASE}/${MODEL_ID}:generateContent?key=${apiKey}`;

  const response = await fetch(streamUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    const fallback = await fetch(fallbackUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    });

    if (!fallback.ok) {
      const error = new Error('Gemini request failed');
      (error as { status?: number }).status = fallback.status;
      throw error;
    }

    const data = await fallback.json();
    return simulateStreaming(data, onChunk, signal);
  }

  if (!response.body) {
    const data = await response.json();
    return simulateStreaming(data, onChunk, signal);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let resultText = '';
  let finishReason: string | undefined;
  let blocked = false;

  const parser = createSseParser((message) => {
    if (message.data === '[DONE]') return;
    const payload = JSON.parse(message.data);
    const parsed = parsePayload(payload);

    if (parsed.blocked) {
      blocked = true;
    }
    if (parsed.finishReason) {
      finishReason = parsed.finishReason;
    }
    if (parsed.text) {
      resultText += parsed.text;
      onChunk(parsed.text);
    }
  });

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    parser.feed(decoder.decode(value, { stream: true }));
  }

  parser.flush();

  return { text: resultText, finishReason, blocked };
};
