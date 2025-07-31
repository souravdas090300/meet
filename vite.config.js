import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        "id": process.env.VERCEL ? "/" : "/meet/",
        "short_name": "Meet App",
        "name": "Meet - Event Discovery App",
        "description": "Find events happening in your city",
        "icons": [
          {
            "src": "favicon.ico",
            "sizes": "48x48",
            "type": "image/x-icon",
            "purpose": "any"
          },
          {
            "src": "meet-app-144.png",
            "type": "image/png",
            "sizes": "144x144",
            "purpose": "any"
          },
          {
            "src": "meet-app-192.png",
            "type": "image/png",
            "sizes": "192x192",
            "purpose": "any"
          },
          {
            "src": "meet-app-512.png",
            "type": "image/png",
            "sizes": "512x512",
            "purpose": "any maskable"
          }
        ],
        "screenshots": [
          {
            "src": "meet-app-512.png",
            "sizes": "512x512",
            "type": "image/png",
            "form_factor": "narrow",
            "label": "Meet App mobile view"
          },
          {
            "src": "meet-app-512.png",
            "sizes": "512x512",
            "type": "image/png",
            "form_factor": "wide",
            "label": "Meet App desktop view"
          }
        ],
        "start_url": process.env.VERCEL ? "/" : "/meet/",
        "scope": process.env.VERCEL ? "/" : "/meet/",
        "display": "standalone",
        "orientation": "portrait-primary",
        "theme_color": "#000000",
        "background_color": "#ffffff",
        "categories": ["productivity", "social", "entertainment"],
        "lang": "en"
      },
      srcDir: 'src',
      filename: 'service-worker.js',
      registerType: 'autoUpdate',
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\/.*\.png$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 50,
              },
            },
          },
        ],
      },
    })
  ],
  // Use different base paths for different environments
  base: process.env.VERCEL ? '/' : '/meet/',
  server: {
    host: true,
    port: 5173
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts']
        }
      }
    }
  },
  publicDir: 'public'
})
