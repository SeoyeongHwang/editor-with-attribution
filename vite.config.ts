import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/editor-with-attribution/',
  plugins: [react()],
  server: {
    proxy: {
      '/editor-with-attribution/api': {
        target: 'https://semantic-cue-worker.editor-with-attribution.workers.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/editor-with-attribution\/api/, '')
      }
    }
  }
})
