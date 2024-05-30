import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import sass from 'sass';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
      },
    },
  },
  optimizeDeps: {
    include: [
      '@fortawesome/react-fontawesome',
      '@fortawesome/free-solid-svg-icons',
    ],
    exclude: [
      '@fortawesome/fontawesome-svg-core',
    ],
  },
  build: {
    rollupOptions: {
      external: ['@fortawesome/fontawesome-svg-core'],
    },
  },

  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass,
      },
    },
  },
});
