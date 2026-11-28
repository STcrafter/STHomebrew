import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const base = process.env.VITE_BASE_PATH || '/STHomebrew/';

// GitHub Pages использует 404.html как запасную страницу для SPA-маршрутов.
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'spa-404-fallback',
      closeBundle() {
        const dist = path.resolve('dist');
        const index = path.join(dist, 'index.html');
        if (fs.existsSync(index)) {
          fs.copyFileSync(index, path.join(dist, '404.html'));
        }
      },
    },
  ],
  base,
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/react') || id.includes('/node_modules/scheduler')) {
            return 'react-vendor';
          }
          if (id.includes('/node_modules/')) return 'vendor';
        },
      },
    },
  },
});
