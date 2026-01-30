import { defineConfig, devices } from '@playwright/test';
import { createRequire } from 'node:module';

process.env.E2E = process.env.E2E ?? '1';

const resolveEsbuildBinaryPath = () => {
  if (process.platform !== 'win32') return undefined;
  try {
    const viteRequire = createRequire(createRequire(import.meta.url).resolve('vite'));
    const esbuildRequire = createRequire(viteRequire.resolve('esbuild'));
    return esbuildRequire.resolve('@esbuild/win32-x64/esbuild.exe');
  } catch {
    return undefined;
  }
};

const esbuildBinaryPath = resolveEsbuildBinaryPath();
const webServerEnv = esbuildBinaryPath
  ? { ...process.env, ESBUILD_BINARY_PATH: esbuildBinaryPath }
  : undefined;

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: 'test-results',
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm run dev -- --host 127.0.0.1 --port 3000',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: true,
    timeout: 120_000,
    env: webServerEnv,
  },
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }], ['list']],
});
