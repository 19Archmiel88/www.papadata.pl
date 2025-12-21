export type SseMessage = {
  event?: string;
  data: string;
};

type SseHandler = (message: SseMessage) => void;

const parseEvent = (raw: string, onMessage: SseHandler) => {
  const lines = raw.split('\n');
  let data = '';
  let event = '';

  for (const line of lines) {
    if (line.startsWith('data:')) {
      data += `${line.slice(5).trimStart()}\n`;
      continue;
    }
    if (line.startsWith('event:')) {
      event = line.slice(6).trim();
    }
  }

  const normalized = data.trimEnd();
  if (!normalized) return;
  onMessage({ data: normalized, event: event || undefined });
};

export const createSseParser = (onMessage: SseHandler) => {
  let buffer = '';

  return {
    feed(chunk: string) {
      buffer += chunk;
      const parts = buffer.split('\n\n');
      buffer = parts.pop() ?? '';
      for (const part of parts) {
        parseEvent(part, onMessage);
      }
    },
    flush() {
      if (buffer) {
        parseEvent(buffer, onMessage);
        buffer = '';
      }
    },
  };
};

const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason ?? new DOMException('Aborted', 'AbortError'));
      return;
    }
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(signal.reason ?? new DOMException('Aborted', 'AbortError'));
      },
      { once: true },
    );
  });

export const chunkText = (value: string, size: number) => {
  const chunks: string[] = [];
  let index = 0;
  while (index < value.length) {
    chunks.push(value.slice(index, index + size));
    index += size;
  }
  return chunks;
};

export const streamChunks = async (
  chunks: string[],
  onChunk: (chunk: string) => void,
  signal?: AbortSignal,
  delayMs = 24,
) => {
  for (const chunk of chunks) {
    if (signal?.aborted) {
      throw signal.reason ?? new DOMException('Aborted', 'AbortError');
    }
    onChunk(chunk);
    await sleep(delayMs, signal);
  }
};
