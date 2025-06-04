import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
  env: {
    testUser: {
      email: 'test@example.com',
      password: 'testPassword123',
    },
  },
  video: false,
  screenshotOnRunFailure: true,
  retries: {
    runMode: 2,
    openMode: 0,
  },
}); 