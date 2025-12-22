import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { streamGeminiResponse } from '../services/ai/geminiClient';
import { SUGGESTION_KEYS, SYSTEM_PROMPT } from '../services/ai/promptRegistry';
import { DEFAULT_BUDGET, applyTokenBudget, truncateText, type ChatMessage } from '../services/ai/tokenBudget';

export type AiMessageRole = 'user' | 'assistant';

export type AiMessage = {
  id: string;
  role: AiMessageRole;
  content: string;
};

export type AiErrorType = 'noKey' | 'offline' | 'timeout' | 'blocked' | 'generic';

type AiStatus = 'idle' | 'streaming';

const REQUEST_TIMEOUT_MS = 20000;

const createId = () => `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const useAiChat = () => {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<AiStatus>('idle');
  const [error, setError] = useState<AiErrorType | null>(null);

  const messagesRef = useRef(messages);
  const abortRef = useRef<AbortController | null>(null);
  const cancelReasonRef = useRef<'user' | 'timeout' | null>(null);
  const assistantTextRef = useRef('');

  const apiKey = (import.meta as { env: Record<string, string | undefined> }).env
    .VITE_GEMINI_API_KEY;
  const hasApiKey = Boolean(apiKey && apiKey.trim());

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const suggestions = useMemo(() => SUGGESTION_KEYS, []);

  const sendMessage = useCallback(async () => {
    if (status === 'streaming') return;
    const trimmed = input.trim();
    if (!trimmed) return;

    if (!hasApiKey) {
      setError('noKey');
      return;
    }

    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      setError('offline');
      return;
    }

    setError(null);
    setStatus('streaming');

    const preparedInput = truncateText(trimmed, DEFAULT_BUDGET.maxInputChars);
    const userMessage: AiMessage = {
      id: createId(),
      role: 'user',
      content: preparedInput,
    };
    const assistantId = createId();
    const assistantMessage: AiMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput('');
    assistantTextRef.current = '';

    const controller = new AbortController();
    abortRef.current = controller;
    cancelReasonRef.current = null;

    const timeoutId = window.setTimeout(() => {
      cancelReasonRef.current = 'timeout';
      controller.abort();
    }, REQUEST_TIMEOUT_MS);

    const baseMessages: ChatMessage[] = messagesRef.current.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    const budgeted = applyTokenBudget([...baseMessages, { role: 'user', content: preparedInput }]);

    try {
      const result = await streamGeminiResponse({
        apiKey: apiKey ?? '',
        messages: budgeted,
        systemPrompt: SYSTEM_PROMPT,
        signal: controller.signal,
        onChunk: (chunk) => {
          assistantTextRef.current += chunk;
          setMessages((prev) =>
            prev.map((message) =>
              message.id === assistantId
                ? { ...message, content: assistantTextRef.current }
                : message,
            ),
          );
        },
      });

      if (result.blocked) {
        setMessages((prev) => prev.filter((message) => message.id !== assistantId));
        setError('blocked');
      }
    } catch {
      if (controller.signal.aborted) {
        if (cancelReasonRef.current === 'timeout') {
          setError('timeout');
          if (!assistantTextRef.current) {
            setMessages((prev) => prev.filter((message) => message.id !== assistantId));
          }
        } else if (!assistantTextRef.current) {
          setMessages((prev) => prev.filter((message) => message.id !== assistantId));
        }
      } else if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        setError('offline');
        setMessages((prev) => prev.filter((message) => message.id !== assistantId));
      } else {
        setError('generic');
        setMessages((prev) => prev.filter((message) => message.id !== assistantId));
      }
    } finally {
      window.clearTimeout(timeoutId);
      setStatus('idle');
      abortRef.current = null;
      cancelReasonRef.current = null;
    }
  }, [hasApiKey, input, status, apiKey]);

  const cancel = useCallback(() => {
    if (!abortRef.current) return;
    cancelReasonRef.current = 'user';
    abortRef.current.abort();
  }, []);

  return {
    messages,
    input,
    setInput,
    status,
    error,
    hasApiKey,
    suggestions,
    sendMessage,
    cancel,
  };
};
