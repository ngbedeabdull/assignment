import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for universal static hosting
  server: {
    port: 3000,
    open: false
  }
});
