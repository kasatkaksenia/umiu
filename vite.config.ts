import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the site from /umiu/. Capacitor (iOS) loads files from the app bundle,
// so native builds use relative paths instead. Run `npm run build -- --mode native` for that.
export default defineConfig(({ mode }) => ({
  base: mode === 'native' ? './' : '/umiu/',
  // Custom JSX runtime: translates interface text on render (src/lib/i18n.ts).
  plugins: [react({ jsxImportSource: 'umiu-i18n' })],
  // Local package (src/i18n): serve it as source so dictionary edits show up without a restart.
  optimizeDeps: { exclude: ['umiu-i18n'] },
  build: { outDir: 'dist', chunkSizeWarningLimit: 1500 },
}));
