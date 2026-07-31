/**
 * Config for `npm run bench`. Separate from the main test config so the
 * relevancy report — which prints numbers rather than asserting them — does not
 * run as part of `npm test` or CI.
 */
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.bench.ts'],
    disableConsoleIntercept: true,
    // These files report by printing. Run them one at a time so the two
    // reports do not interleave into nonsense.
    fileParallelism: false,
  },
})
