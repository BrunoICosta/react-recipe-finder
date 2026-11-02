import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

/** The production build is served from https://portfolio.brunoisaac.dev/react-recipe-finder/. */
const APP_BASE = '/react-recipe-finder/'

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? APP_BASE : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Keep React and the router in a long-lived vendor chunk.
        manualChunks: {
          react: ['react', 'react-dom', 'react-dom/client', 'react-router'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
    restoreMocks: true,
    // Typing-heavy form tests can exceed the 5s default on slow CI runners.
    testTimeout: 15_000,
  },
}))
