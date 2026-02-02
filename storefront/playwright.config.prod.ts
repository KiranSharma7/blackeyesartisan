import path from 'path'

import { defineConfig, devices } from '@playwright/test'

import 'dotenv/config.js'

export const STORAGE_STATE = path.join(__dirname, 'playwright/.auth/user.json')

export default defineConfig({
  timeout: 60000,

  expect: {
    timeout: 30000,
  },

  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1, // 1 retry for production tests
  /* Opt out of parallel tests on CI. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://www.blackeyesartisan.shop',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'retain-on-failure',

    /* Take screenshot on failure */
    screenshot: 'only-on-failure',

    /* Capture video on failure */
    video: 'retain-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      testMatch: /global\/setup\.ts/,
      teardown: 'cleanup test database',
    },
    {
      name: 'public setup',
      testMatch: /global\/public-setup\.ts/,
      teardown: 'cleanup test database',
    },
    {
      name: 'cleanup test database',
      testMatch: /global\/teardown\.ts/,
    },
    {
      name: 'chromium auth',
      dependencies: ['setup'],
      testIgnore: ['public/*.spec.ts', 'tests/medusa-test-specs'],
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'chromium public',
      dependencies: ['public setup'],
      testMatch: 'public/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* No webServer for production testing - we test against live site */
})
