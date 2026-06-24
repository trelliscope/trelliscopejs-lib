import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';

// Standalone config for unit tests so we don't pull in the dev-server example
// logic in vite.config.ts. Scoped to `*.unit.test.ts` and excludes the Playwright
// e2e specs under `tests/`.
export default defineConfig({
  plugins: [react(), viteTsconfigPaths()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.unit.test.ts'],
    exclude: ['tests/**', 'node_modules/**'],
  },
});
