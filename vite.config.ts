import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('@react-pdf') || id.includes('react-pdf'))
            return 'pdf';
          if (id.includes('@tiptap') || id.includes('prosemirror'))
            return 'editor';
          if (id.includes('@clerk')) return 'clerk';
          if (id.includes('@dnd-kit')) return 'dnd';
          if (id.includes('@ai-sdk') || id.includes('node_modules/ai/'))
            return 'ai';
          if (id.includes('mobx')) return 'mobx';
          if (id.includes('node_modules/react-dom')) return 'react-dom';
          if (id.includes('node_modules/react-router')) return 'react-router';
          if (id.includes('node_modules/zod')) return 'zod';
          if (
            id.includes('framer-motion') ||
            id.includes('node_modules/motion')
          )
            return 'motion';
          if (id.includes('node_modules/lucide-react')) return 'lucide';
          if (id.includes('node_modules/@radix-ui')) return 'radix';
          if (id.includes('node_modules/shepherd')) return 'shepherd';
          if (id.includes('node_modules/dexie')) return 'dexie';
        },
      },
    },
  },
});
