import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');
  const apiTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:4000';
  let sentryAlias: Record<string, string> = {};

  try {
    require.resolve('@sentry/browser', { paths: [__dirname] });
  } catch {
    sentryAlias = {
      '@sentry/browser': path.resolve(__dirname, './utils/sentry.stub.ts')
    };
  }

  return {
    root: __dirname,
    envDir: __dirname,
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: false
        }
      }
    },
    plugins: [react()],
    resolve: {
      extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json'],
      alias: {
        '@': path.resolve(__dirname, '.'),
        '@papadata/shared': path.resolve(__dirname, '../../libs/shared/src/index.ts'),
        ...sentryAlias
      }
    },
    test: {
      environment: 'jsdom',
      globals: true,
      include: ['tests/unit/**/*.test.ts'],
      exclude: ['tests/e2e/**']
    }
  };
});
