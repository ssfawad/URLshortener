import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // In dev, proxy API and redirect calls to the local backend
      '/api': 'http://localhost:8080',
      '/r': 'http://localhost:8080',
    },
  },
})
