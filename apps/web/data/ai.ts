import type { AIChatRequest } from '@papadata/shared';
import { getWebConfig } from '../config';
import { ApiRequestError, apiRequestRaw } from './api';

export type StreamChatError = {
  message: string;
  requestId?: string;
  status?: number;
  isNetworkError?: boolean;
};

export type StreamChatHandlers = {
  signal?: AbortSignal;
  onToken: (token: string) => void;
  onDone?: () => void;
  onError?: (error: StreamChatError) => void;
};

const emitError = (handlers: StreamChatHandlers, error: StreamChatError) => {
  if (handlers.onError) {
    handlers.onError(error);
    return;
  }
  throw new Error(error.message);
};

const parseEventChunk = (chunk: string, onToken: (token: string) => void, onDone?: () => void): boolean => {
  const lines = chunk.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith(':')) continue;
    if (!trimmed.startsWith('data:')) continue;
    const payload = trimmed.replace(/^data:\s?/, '');
    if (payload === '[DONE]') {
      onDone?.();
      return true;
    }
    try {
      const parsed = JSON.parse(payload) as { text?: string };
      if (parsed?.text) onToken(parsed.text);
    } catch {
      onToken(payload);
    }
  }
  return false;
};

export const streamChat = async (payload: AIChatRequest, handlers: StreamChatHandlers): Promise<void> => {
  try {
    const response = await apiRequestRaw(
      'POST',
      '/ai/chat?stream=1',
      payload,
      {
        signal: handlers.signal,
        timeoutMs: getWebConfig().api.aiTimeoutMs,
        headers: { Accept: 'text/event-stream' },
      },
    );

    const contentType = response.headers.get('content-type') ?? '';

    if (!contentType.includes('text/event-stream') || !response.body) {
      const text = await response.text();
      if (text) handlers.onToken(text);
      handlers.onDone?.();
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let separatorIndex = buffer.indexOf('\n\n');
      while (separatorIndex !== -1) {
        const rawChunk = buffer.slice(0, separatorIndex).trim();
        buffer = buffer.slice(separatorIndex + 2);
        if (rawChunk) {
          const finished = parseEventChunk(rawChunk, handlers.onToken, handlers.onDone);
          if (finished) return;
        }
        separatorIndex = buffer.indexOf('\n\n');
      }
    }

    if (buffer.trim()) {
      parseEventChunk(buffer.trim(), handlers.onToken, handlers.onDone);
    }

    handlers.onDone?.();
  } catch (err: unknown) {
    if (err instanceof ApiRequestError) {
      emitError(handlers, {
        message: err.message,
        status: err.status,
        requestId: err.requestId,
        isNetworkError: err.code === 'NETWORK_ERROR' || err.code === 'TIMEOUT',
      });
      return;
    }

    const message = err instanceof Error ? err.message : 'AI request failed.';
    emitError(handlers, { message, isNetworkError: true });
  }
};
