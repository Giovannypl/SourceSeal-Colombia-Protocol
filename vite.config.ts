import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',  // backend local
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/seals': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});