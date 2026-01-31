import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://front-task--progress-tracker-mvp-arrive.fin1.bult.app',
        changeOrigin: true,
      },
    },
  },
})
