// Playwright is used here only to replay the executed manual cases and capture evidence.
const { defineConfig, devices } = require('@playwright/test');

const isCI = !!process.env.CI;

module.exports = defineConfig({
  testDir: '.',
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,
  workers: isCI ? 2 : 2, // public practice sites: stay gentle
  retries: 0, // a failure is a result to record, not something to hide
  reporter: [
    isCI ? ['github'] : ['list'],
    ['html', { outputFolder: '../playwright-report', open: 'never' }],
    ['./support/results-reporter.js', { outputFile: 'execution/results/run-results.json' }],
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    viewport: { width: 1280, height: 720 },
  },
  outputDir: '../test-results',
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
