import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const defaultPrompt =
  "Sprawdz prosze dane sprzedazy za ostatni tydzien.";

const isTruthy = (value) =>
  value !== undefined && value !== null && String(value).trim().length > 0;

const assertOk = async (response, label) => {
  if (response.ok) return;
  const body = await response.text().catch(() => "");
  throw new Error(
    `${label} failed with status ${response.status}. Body: ${body}`,
  );
};

const assertJsonResponse = (payload) => {
  if (!payload || typeof payload !== "object") {
    throw new Error("AI chat JSON response is not an object.");
  }
  if (!isTruthy(payload.text)) {
    throw new Error("AI chat JSON response missing 'text'.");
  }
};

const parseSse = (chunk, state) => {
  state.buffer += chunk;
  let idx = state.buffer.indexOf("\n");
  while (idx !== -1) {
    const line = state.buffer.slice(0, idx).trimEnd();
    state.buffer = state.buffer.slice(idx + 1);
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith(":")) {
      idx = state.buffer.indexOf("\n");
      continue;
    }
    if (trimmed.startsWith("data:")) {
      const data = trimmed.slice(5).trim();
      if (data === "[DONE]") {
        state.sawDone = true;
      } else {
        state.sawData = true;
        try {
          const parsed = JSON.parse(data);
          if (!isTruthy(parsed?.text)) {
            throw new Error("SSE data chunk missing 'text'.");
          }
        } catch (error) {
          state.errors.push(
            error instanceof Error ? error.message : String(error),
          );
        }
      }
    }
    idx = state.buffer.indexOf("\n");
  }
};

const jsonRequest = async ({ baseUrl, prompt }) => {
  const response = await fetch(`${baseUrl}/api/ai/chat?stream=0`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  await assertOk(response, "AI chat JSON");

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new Error(`Unexpected JSON content-type: ${contentType}`);
  }

  const payload = await response.json();
  assertJsonResponse(payload);
  return payload;
};

const sseRequest = async ({ baseUrl, prompt }) => {
  const response = await fetch(`${baseUrl}/api/ai/chat?stream=1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({ prompt }),
  });

  await assertOk(response, "AI chat SSE");

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("text/event-stream")) {
    throw new Error(`Unexpected SSE content-type: ${contentType}`);
  }

  if (!response.body) {
    throw new Error("AI chat SSE response has no body stream.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const state = {
    buffer: "",
    sawData: false,
    sawDone: false,
    errors: [],
  };

  let done = false;
  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    if (value) {
      parseSse(decoder.decode(value, { stream: true }), state);
    }
  }

  if (state.errors.length > 0) {
    throw new Error(`SSE parse errors: ${state.errors.join("; ")}`);
  }

  if (!state.sawData) {
    throw new Error("SSE stream did not emit any data messages.");
  }
  if (!state.sawDone) {
    throw new Error("SSE stream missing [DONE] terminator.");
  }

  await delay(0);
};

export const runAiChatChecks = async ({ baseUrl, prompt } = {}) => {
  const resolvedBaseUrl =
    baseUrl || process.env.API_URL || process.env.API || "http://localhost:4000";
  const resolvedPrompt =
    prompt || process.env.AI_PROMPT || defaultPrompt;

  const jsonResponse = await jsonRequest({
    baseUrl: resolvedBaseUrl,
    prompt: resolvedPrompt,
  });
  await sseRequest({ baseUrl: resolvedBaseUrl, prompt: resolvedPrompt });
  return { jsonResponse };
};

const isMain = () => {
  const entry = process.argv[1];
  if (!entry) return false;
  const entryPath = path.resolve(entry);
  const selfPath = fileURLToPath(import.meta.url);
  return entryPath === selfPath;
};

if (isMain()) {
  runAiChatChecks()
    .then(() => {
      console.log("AI chat checks passed.");
    })
    .catch((error) => {
      console.error("AI chat checks failed.", error);
      process.exitCode = 1;
    });
}
