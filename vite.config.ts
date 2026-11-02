import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the site from /umiu/. Capacitor (iOS) loads files from the app bundle,
// so native builds use relative paths instead. Run `npm run build -- --mode native` for that.
export default defineConfig(({ mode }) => ({
  base: mode === 'native' ? './' : '/umiu/',
  plugins: [react()],
  build: { outDir: 'dist', chunkSizeWarningLimit: 1500 },
}));
