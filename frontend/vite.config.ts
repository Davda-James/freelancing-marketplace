import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        format: 'es',
          manualChunks: {
            vendor: ['react', 'react-dom', '@clerk/clerk-react', 'lucide-react'],
          }
      }
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  }
})
