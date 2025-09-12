import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: '/',
  // TODO: enable when deploying to public GitHub Pages,
  // base: command === 'build' ? '/nuclea-demo/' : '/',
  server: {
    port: 5173,
    proxy: {
      '/api': command === 'build' ? 'http://localhost:5000' : 'https://nuclea-kendo-demo.azurewebsites.net/',
    }
  }
}))
