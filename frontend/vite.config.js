// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: __dirname,
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  server: {
    proxy: {
      '/api': { target: 'http://localhost:5174', changeOrigin: true },
      '/uploads': { target: 'http://localhost:5174', changeOrigin: true },
    },
  },
  build: {
    outDir: 'dist',
    manifest: true,
    emptyOutDir: true,   // без rollupOptions.input
  },
})
