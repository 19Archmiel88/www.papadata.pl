
import { defineConfig, devices } from '@playwright/experimental-ct-react';
import path from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  testDir: './tests/ct',
  timeout: 30_000,
  retries: 0,
  use: {
    viewport: { width: 1280, height: 720 },
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  ctViteConfig: {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        '@papadata/shared': path.resolve(__dirname, '../../libs/shared/src/index.ts'),
      },
    },
    define: {
      'import.meta.env.VITE_APP_ENV': JSON.stringify('test'),
      'import.meta.env.MODE': JSON.stringify('test'),
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify('/api'),
      'import.meta.env.VITE_API_TIMEOUT_MS': JSON.stringify('25000'),
    },
  },
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],
});
