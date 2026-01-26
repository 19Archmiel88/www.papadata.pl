import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { runAiChatChecks } from "./check-ai-chat.mjs";
import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const normalizeBaseUrl = (value) =>
  value.includes("localhost") ? value.replace("localhost", "127.0.0.1") : value;
const baseUrl = normalizeBaseUrl(
  process.env.API_URL || process.env.API || "http://127.0.0.1:4000",
);
const port = new URL(baseUrl).port || "4000";

const ensureApiBuild = async () => {
  const apiDist = path.join(repoRoot, "apps", "api", "dist", "main.js");
  if (existsSync(apiDist)) return;
  const apiBuildInfo = path.join(
    repoRoot,
    "apps",
    "api",
    "tsconfig.build.tsbuildinfo",
  );
  if (existsSync(apiBuildInfo)) {
    await rm(apiBuildInfo, { force: true });
  }
  await new Promise((resolve, reject) => {
    const child = spawn("pnpm", ["-w", "--filter", "@papadata/api", "build"], {
      cwd: repoRoot,
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`API build failed (${code}).`));
    });
  });
};

const spawnApi = () => {
  const apiCwd = path.join(repoRoot, "apps", "api");
  return spawn(process.execPath, ["dist/main.js"], {
    cwd: apiCwd,
    stdio: "inherit",
    env: {
      ...process.env,
      PORT: String(port),
      APP_MODE: process.env.APP_MODE || "demo",
      NODE_ENV: process.env.NODE_ENV || "production",
      ENV_OVERRIDE: process.env.ENV_OVERRIDE || "0",
      ENTITLEMENTS_PLAN: process.env.ENTITLEMENTS_PLAN || "professional",
      ENTITLEMENTS_BILLING_STATUS:
        process.env.ENTITLEMENTS_BILLING_STATUS || "active",
      ENTITLEMENTS_CACHE_TTL_MS:
        process.env.ENTITLEMENTS_CACHE_TTL_MS || "0",
    },
  });
};

const waitForOk = async (url, timeoutMs = 60000) => {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url, { method: "GET" });
      if (response.ok) return;
    } catch {
      // ignore
    }
    await delay(1000);
  }
  throw new Error(`Timed out waiting for ${url}`);
};

const fetchJson = async (url, label) => {
  const response = await fetch(url, { method: "GET" });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`${label} failed ${response.status}: ${body}`);
  }
  const payload = await response.json();
  if (!payload || typeof payload !== "object") {
    throw new Error(`${label} response is not JSON object.`);
  }
  return payload;
};

const stopProcess = async (child) => {
  if (!child || child.killed) return;
  child.kill("SIGINT");
  const timeout = Date.now() + 10000;
  while (Date.now() < timeout) {
    if (child.exitCode !== null) return;
    await delay(250);
  }
  child.kill("SIGKILL");
};

const main = async () => {
  await ensureApiBuild();
  const apiProcess = spawnApi();
  try {
    await waitForOk(`${baseUrl}/api/health`);
    await fetchJson(`${baseUrl}/api/health`, "GET /api/health");
    await fetchJson(`${baseUrl}/api/dashboard/overview`, "GET /api/dashboard/overview");
    await runAiChatChecks({ baseUrl });
  } finally {
    await stopProcess(apiProcess);
  }
};

main().catch((error) => {
  console.error("Runtime smoke failed.", error);
  process.exitCode = 1;
});
