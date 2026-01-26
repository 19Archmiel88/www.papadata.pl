const defaultPrompt = "Return exactly two lines:\nPL: pong\nEN: pong";

const normalizeBase = (value) => (value.endsWith("/") ? value.slice(0, -1) : value);

const apiBase = normalizeBase(
  process.env.API_BASE ||
    process.env.API_URL ||
    process.env.API ||
    "https://api.papadata.pl/api",
);

const webBase = process.env.WEB_BASE || process.env.WEB_URL || process.env.WEB;

const authToken = process.env.AUTH_TOKEN;
const tenantId = process.env.TENANT_ID;

// Deterministyczny prompt dla smoke (możesz nadpisać przez env)
const prompt = process.env.AI_PROMPT || defaultPrompt;

const jsonHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};
if (authToken) jsonHeaders.Authorization = `Bearer ${authToken}`;
if (tenantId) jsonHeaders["X-Tenant-Id"] = tenantId;

const logPass = (label) => console.log(`PASS ${label}`);

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

const extractChatText = (payload) => {
  const text =
    typeof payload.text === "string" && payload.text.trim()
      ? payload.text
      : typeof payload.content === "string" && payload.content.trim()
        ? payload.content
        : null;
  return text;
};

const assertChatResponse = (payload) => {
  const text = extractChatText(payload);
  if (!text) throw new Error("AI chat JSON response missing text/content.");

  if (payload.finishReason !== undefined && typeof payload.finishReason !== "string") {
    throw new Error("AI chat JSON response has invalid finishReason.");
  }

  const hasPL = /(^|\n)PL:\s*/i.test(text);
  const hasEN = /(^|\n)EN:\s*/i.test(text);
  if (!hasPL || !hasEN) {
    throw new Error("AI smoke response missing PL:/EN: sections.");
  }
};

// SSE: parsujemy eventy data: {...} i sklejamy "text" żeby sprawdzić PL/EN.
const extractSseText = (body) => {
  const lines = body.split("\n");
  let acc = "";
  for (const line of lines) {
    if (!line.startsWith("data:")) continue;
    const data = line.slice("data:".length).trim();
    if (!data || data === "[DONE]") continue;

    try {
      const payload = JSON.parse(data);
      if (payload && typeof payload.text === "string") {
        acc += payload.text;
      }
    } catch {
      // ignorujemy linie, które nie są JSON (np. jakieś komentarze)
    }
  }
  return acc.trim();
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
  const url = `${apiBase}/ai/chat?stream=0&smoke=1`;
  const payload = await fetchJson(
    url,
    {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({ prompt }),
    },
    "POST /ai/chat?stream=0&smoke=1",
  );
  assertChatResponse(payload);
};

const runAiSseCheck = async () => {
  const url = `${apiBase}/ai/chat?stream=1&smoke=1`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...jsonHeaders,
      Accept: "text/event-stream",
    },
    body: JSON.stringify({ prompt }),
  });

  await assertOk(response, "POST /ai/chat?stream=1&smoke=1");
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("text/event-stream")) {
    throw new Error(`SSE unexpected content-type: ${contentType}`);
  }

  const body = await response.text();

  if (!body.includes("[DONE]")) {
    throw new Error("SSE stream missing [DONE] terminator.");
  }

  const text = extractSseText(body);
  if (!text) {
    throw new Error("SSE smoke response missing text chunks.");
  }

  const hasPL = /(^|\n)PL:\s*/i.test(text);
  const hasEN = /(^|\n)EN:\s*/i.test(text);
  if (!hasPL || !hasEN) {
    throw new Error("SSE smoke response missing PL:/EN: sections.");
  }
};

const runCorsCheck = async () => {
  if (!webBase) return;
  const url = `${apiBase}/health`;
  const response = await fetch(url, {
    method: "GET",
    headers: { Origin: webBase },
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
  if (webBase) console.log(`WEB_BASE=${webBase}`);
  if (authToken) console.log("AUTH_TOKEN=present");
  if (tenantId) console.log(`TENANT_ID=${tenantId}`);

  await runStep("health", runHealthCheck);
  await runStep("ai chat json (smoke)", runAiJsonCheck);
  await runStep("ai chat sse (smoke)", runAiSseCheck);
  if (webBase) await runStep("cors", runCorsCheck);
};

main().catch(() => {
  process.exitCode = 1;
});
