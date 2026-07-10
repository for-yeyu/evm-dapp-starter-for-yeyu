import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    include: ['src/**/test/**/*.test.ts'],
    passWithNoTests: true,
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/api/**/*.ts', 'src/configs/**/*.ts', 'src/lib/**/*.ts', 'src/app/api/**/*.ts'],
      exclude: ['src/**/test/**', 'src/**/types/**', 'src/**/*.d.ts', 'src/lib/utils/shadcn/**'],
    },
  },
})
