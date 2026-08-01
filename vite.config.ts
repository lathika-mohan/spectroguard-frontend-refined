import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'serve-dash-content',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const decodedUrl = decodeURIComponent(req.url || '');
          if (decodedUrl.startsWith('/DASH CONTENT/')) {
            const filename = decodedUrl.replace('/DASH CONTENT/', '');
            const filePath = path.resolve('C:/Users/AKILA/OneDrive/Desktop/DASH CONTENT', filename);
            if (fs.existsSync(filePath)) {
              res.setHeader('Content-Type', 'image/jpeg');
              fs.createReadStream(filePath).pipe(res);
              return;
            }
          }
          next();
        });
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    // Expand threshold limit to accommodate the 2MB+ Spline engine dependencies without warning alerts
    chunkSizeWarningLimit: 2500,
  },
})
