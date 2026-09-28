import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
  server: { proxy: { '/graphql': 'http://127.0.0.1:4300', '/health': 'http://127.0.0.1:4300' } },
});
