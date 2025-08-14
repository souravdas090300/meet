import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        "id": process.env.NODE_ENV === 'production' ? "/meet/" : "/",
        "short_name": "Meet App",
        "name": "Meet - Event Discovery App",
        "description": "Find events happening in your city",
        "icons": [
          {
            "src": "./meet-app-144.png",
            "type": "image/png",
            "sizes": "144x144",
            "purpose": "any"
          },
          {
            "src": "./meet-app-192.png",
            "type": "image/png",
            "sizes": "192x192",
            "purpose": "any"
          },
          {
            "src": "./meet-app-512.png",
            "type": "image/png",
            "sizes": "512x512",
            "purpose": "any maskable"
          }
        ],
        "screenshots": [
          {
            "src": "./meet-app-512.png",
            "sizes": "512x512",
            "type": "image/png",
            "form_factor": "narrow",
            "label": "Meet App mobile view"
          },
          {
            "src": "./meet-app-512.png",
            "sizes": "512x512",
            "type": "image/png",
            "form_factor": "wide",
            "label": "Meet App desktop view"
          }
        ],
        "start_url": process.env.NODE_ENV === 'production' ? "/meet/" : "/",
        "scope": process.env.NODE_ENV === 'production' ? "/meet/" : "/",
        "display": "standalone",
        "orientation": "any",
        "theme_color": "#000000",
        "background_color": "#ffffff",
        "categories": ["productivity", "social", "entertainment"],
        "lang": "en"
      },
      srcDir: 'src',
      filename: 'service-worker.js',
      registerType: 'prompt',
      injectRegister: false,
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
          {
            urlPattern: /^https:\/\/.*\.googleapis\.com\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-apis',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.vercel\.app\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60, // 1 hour
              },
              networkTimeoutSeconds: 10,
            },
          },
        ],
      },
    })
  ],
  // Use different base paths for different environments
  base: process.env.NODE_ENV === 'production' ? '/meet/' : '/',
  server: {
    host: true,
    port: 5173
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
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
