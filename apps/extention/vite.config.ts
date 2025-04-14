// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

export default defineConfig({
  plugins: [react()],
  build: {
      rollupOptions: {
          input: resolve(dirname(fileURLToPath(import.meta.url)), 'src/content.tsx'),
          output: {
            entryFileNames: 'content.js',
          },
      },
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: true,
      target: 'esnext',
  },
  });
