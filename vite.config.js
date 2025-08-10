import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false, // We'll handle registration manually
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.js',
      devOptions: {
        enabled: false
      },
      selfDestroying: false,
      includeAssets: ['meet-app-144.png', 'meet-app-192.png', 'meet-app-512.png', 'favicon.ico'],
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff2}'],
        navigateFallback: null, // Prevent issues with GitHub Pages
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
      manifest: false, // We'll use our own manifest.json from public folder
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff2}'],
        swSrc: 'src/service-worker.js',
        swDest: 'dist/service-worker.js',
        dontCacheBustURLsMatching: /\.\w{8}\./,
      }
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
