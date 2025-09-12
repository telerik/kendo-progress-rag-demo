import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/nuclea-demo/' : '/',
  server: {
    port: 5173,
    proxy: {
      // During development, proxy API calls to local server
      '/api': 'http://localhost:5000',
    }
  }
}))
