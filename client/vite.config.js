import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
  },
  server: {
      proxy: {
        "/api": {
          target: "http://amadoudrame.ide.3wa.io:9000",
          changeOrigin: true
        }
      }
    } 
})
