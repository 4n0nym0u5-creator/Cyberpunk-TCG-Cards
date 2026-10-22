import { defineConfig } from 'vite';

// GitHub Pages project site: https://<user>.github.io/Cyberpunk-TCG-Cards/
export default defineConfig({
  base: '/Cyberpunk-TCG-Cards/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
