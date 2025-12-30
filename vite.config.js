import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react-map-gl', 'mapbox-gl']
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://admin.pro-part.es',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
