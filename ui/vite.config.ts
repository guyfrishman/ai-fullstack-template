import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The UI talks to the API directly via VITE_API_BASE_URL (default
// http://localhost:8000). A dev proxy is provided as an alternative: requests
// to /api are forwarded to the API, avoiding CORS during local development.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
