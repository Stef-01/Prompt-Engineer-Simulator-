import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  publicDir: 'src/assets',
  build: {
    assetsDir: '',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            const folder = assetInfo.name.includes('overworld') ? 'overworld' :
                         assetInfo.name.includes('sprites') ? 'sprites' :
                         assetInfo.name.includes('tiles') ? 'tiles' : '';
            return `${folder}/[name][extname]`;
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  },
});
