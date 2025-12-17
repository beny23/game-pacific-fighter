import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages serves this project from /<repo>/
  base: process.env.GITHUB_PAGES ? '/game-pacific-fighter/' : '/',
  server: {
    port: 5173,
    strictPort: true
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/phaser')) return 'phaser';
        }
      }
    }
  }
});
