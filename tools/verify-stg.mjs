const defaultPrompt = "Sprawdz prosze dane sprzedazy za ostatni tydzien.";

const normalizeBase = (value) =>
  value.endsWith("/") ? value.slice(0, -1) : value;

const apiBase = normalizeBase(
  process.env.API_BASE ||
    process.env.API_URL ||
    process.env.API ||
    "https://api.papadata.pl/api",
);
const webBase =
  process.env.WEB_BASE || process.env.WEB_URL || process.env.WEB;

const authToken = process.env.AUTH_TOKEN;
const tenantId = process.env.TENANT_ID;
const prompt = process.env.AI_PROMPT || defaultPrompt;

const jsonHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};
if (authToken) {
  jsonHeaders.Authorization = `Bearer ${authToken}`;
}
if (tenantId) {
  jsonHeaders["X-Tenant-Id"] = tenantId;
}

const logPass = (label) => {
  console.log(`PASS ${label}`);
};

const logFail = (label, error) => {
  console.error(`FAIL ${label}`);
  if (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
  }
};

const assertOk = async (response, label) => {
  if (response.ok) return;
  const body = await response.text().catch(() => "");
  throw new Error(`${label} failed ${response.status}: ${body}`);
};

const assertJsonResponse = (payload, label) => {
  if (!payload || typeof payload !== "object") {
    throw new Error(`${label} response is not JSON object.`);
  }
};

const assertChatResponse = (payload) => {
  const text =
    typeof payload.text === "string" && payload.text.trim()
      ? payload.text
      : typeof payload.content === "string" && payload.content.trim()
        ? payload.content
        : null;
  if (!text) {
    throw new Error("AI chat JSON response missing text/content.");
  }
  if (
    payload.finishReason !== undefined &&
    typeof payload.finishReason !== "string"
  ) {
    throw new Error("AI chat JSON response has invalid finishReason.");
  }
};

const fetchJson = async (url, options, label) => {
  const response = await fetch(url, options);
  await assertOk(response, label);
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new Error(`${label} unexpected content-type: ${contentType}`);
  }
  const payload = await response.json();
  assertJsonResponse(payload, label);
  return payload;
};

const runHealthCheck = async () => {
  const url = `${apiBase}/health`;
  await fetchJson(url, { method: "GET" }, "GET /health");
};

const runAiJsonCheck = async () => {
  const url = `${apiBase}/ai/chat?stream=0`;
  const payload = await fetchJson(
    url,
    {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({ prompt }),
    },
    "POST /ai/chat?stream=0",
  );
  assertChatResponse(payload);
};

const runAiSseCheck = async () => {
  const url = `${apiBase}/ai/chat?stream=1`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...jsonHeaders,
      Accept: "text/event-stream",
    },
    body: JSON.stringify({ prompt }),
  });

  await assertOk(response, "POST /ai/chat?stream=1");
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("text/event-stream")) {
    throw new Error(`SSE unexpected content-type: ${contentType}`);
  }
  const body = await response.text();
  if (!body.includes("[DONE]")) {
    throw new Error("SSE stream missing [DONE] terminator.");
  }
};

const runCorsCheck = async () => {
  if (!webBase) return;
  const url = `${apiBase}/health`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Origin: webBase,
    },
  });
  await assertOk(response, "CORS /health");
  const allowOrigin = response.headers.get("access-control-allow-origin");
  if (allowOrigin !== webBase) {
    throw new Error(
      `CORS allow-origin mismatch: ${allowOrigin ?? "missing"} (expected ${webBase})`,
    );
  }
};

const runStep = async (label, fn) => {
  try {
    await fn();
    logPass(label);
  } catch (error) {
    logFail(label, error);
    throw error;
  }
};

const main = async () => {
  console.log(`API_BASE=${apiBase}`);
  if (webBase) {
    console.log(`WEB_BASE=${webBase}`);
  }
  if (authToken) {
    console.log("AUTH_TOKEN=present");
  }
  if (tenantId) {
    console.log(`TENANT_ID=${tenantId}`);
  }

  await runStep("health", runHealthCheck);
  await runStep("ai chat json", runAiJsonCheck);
  await runStep("ai chat sse", runAiSseCheck);
  if (webBase) {
    await runStep("cors", runCorsCheck);
  }
};

main().catch(() => {
  process.exitCode = 1;
});
