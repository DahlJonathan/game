import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 5173, // Set the frontend server port to 5173
  },
  esbuild: {
    loader: 'jsx', // Ensure esbuild handles JSX files
    include: /src\/.*\.jsx?$/, // Process .jsx and .js files in the src directory
  },
});