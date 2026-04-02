import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/auth': 'http://localhost:8080',
      '/tasks': 'http://localhost:8080',
      '/notifications': 'http://localhost:8080',
    }
  }
})
