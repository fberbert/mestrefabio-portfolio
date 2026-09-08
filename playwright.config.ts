import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 45_000,
  expect: { timeout: 15_000 },
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:43113',
    locale: 'en-US',
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROME_PATH || '/usr/bin/google-chrome' },
  },
  webServer: {
    command: 'node --require ./tests/support/resend-mock.cjs ./node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 43113',
    url: 'http://127.0.0.1:43113',
    reuseExistingServer: false,
    timeout: 60_000,
    env: { RESEND_API_KEY: 're_browser_test_dummy', NEXT_TELEMETRY_DISABLED: '1' },
  },
});
