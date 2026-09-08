import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('.', import.meta.url)) } },
  oxc: { jsx: { runtime: 'automatic' } },
  test: {
    environment: 'jsdom',
    setupFiles: ['tests/setup.ts'],
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    maxWorkers: 1,
    coverage: {
      provider: 'v8',
      include: ['actions/sendEmail.ts', 'lib/contact/**/*.ts', 'lib/site-metadata.ts', 'components/contact-form.tsx', 'components/contact-submit-button.tsx'],
      reporter: ['text', 'json-summary', 'html'],
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
    },
  },
});
