import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: __dirname,
  base: './',
  plugins: [
    svelte(),
    {
      name: 'rename-html-output',
      writeBundle() {
        const from = path.resolve(__dirname, '../index-page.html');
        const to = path.resolve(__dirname, '../index.html');
        if (fs.existsSync(from)) fs.renameSync(from, to);
      },
    },
  ],
  server: {
    port: 5174,
  },
  build: {
    outDir: '../',
    emptyOutDir: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'index-page.html'),
      output: {
        assetFileNames: 'index-assets/[name]-[hash][extname]',
        chunkFileNames: 'index-assets/[name]-[hash].js',
        entryFileNames: 'index-assets/[name]-[hash].js',
      },
    },
  },
});
