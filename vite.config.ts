import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { treeifyError, z } from 'zod';

const nonEmpty = (name: string) =>
  z.string().min(1, `${name} is required and cannot be empty`);

const envSchema = z.object({
  VITE_CLERK_PUBLISHABLE_KEY: nonEmpty('VITE_CLERK_PUBLISHABLE_KEY'),
  VITE_API_URL: nonEmpty('VITE_API_URL').url(
    'VITE_API_URL must be a valid URL'
  ),
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const parsed = envSchema.safeParse(env);
  if (!parsed.success) {
    console.error(
      'Invalid environment variables:',
      treeifyError(parsed.error).properties
    );
    process.exit(1);
  }

  console.info('Environment variables validated & loaded successfully');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      modulePreload: false,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
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
  };
});
