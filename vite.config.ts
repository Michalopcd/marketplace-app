import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  test: {
    // Pure logic tests run in Node; component tests opt in with `// @vitest-environment jsdom`.
    environment: 'node',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/test/**', 'src/main.tsx', 'src/types/**'],
      // skipFull: false – keep fully covered files (e.g. src/redux) visible in the console table.
      reporter: [['text', { skipFull: false }], 'html'],
      // Issue #5: the Redux layer must stay above 80% on every metric.
      thresholds: {
        'src/redux/**': { lines: 80, functions: 80, branches: 80, statements: 80 },
      },
    },
  },
})
