import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import photos from './plugins/photos.js';

export default defineConfig({
  plugins: [react(), tailwindcss(), photos()],
});
