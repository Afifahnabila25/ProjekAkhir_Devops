import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    'process.env': process.env,
  },
  server: {
    proxy: {
      '/my-api': {
        target: 'http://localhost',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/my-api/, '/my-api'),
      },
    },
  },
})
