import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'framer-motion';
            if (id.includes('react-icons') || id.includes('lucide-react')) return 'icons';
            if (id.includes('@tiptap')) return 'tiptap';
            if (id.includes('react') || id.includes('react-dom')) return 'react-vendor';
          }
        },
      },
    },
  },
})

