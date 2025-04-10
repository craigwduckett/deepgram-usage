import https from 'node:https';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      // Proxy all requests to /api/deepgram to the actual Deepgram API
      '/api/deepgram': {
        target: 'https://api.deepgram.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/deepgram/, ''),
        secure: false, // Disable certificate verification for development
        agent: new https.Agent({ rejectUnauthorized: false }), // Skip certificate validation
        configure: (proxy) => {
          // Add event handler for proxied requests
          proxy.on('proxyReq', (proxyReq, req) => {
            // Retrieve API key from custom header
            const apiKey = req.headers['x-api-key'];
            if (apiKey) {
              // Set the Authorization header for Deepgram
              proxyReq.setHeader('Authorization', `Token ${apiKey}`);
            }
          });
        },
      },
    },
  },
});
