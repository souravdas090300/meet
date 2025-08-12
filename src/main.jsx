import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './App.css';
import * as atatus from 'atatus-spa';
import { safeNotify, setAtatusUser } from './utils/atatus-helpers.js';

// Initialize Atatus with proper error handling
let atatusInitialized = false;
window.atatusInitialized = false; // Make it globally available

try {
  const licenseKey = import.meta.env.VITE_ATATUS_LICENSE_KEY || '93a094075aa3483186cf248030fdad97';

  // Re-enable Atatus with SPA-specific configuration
  if (licenseKey && licenseKey !== 'undefined' && typeof atatus.config === 'function') {
    atatus.config(licenseKey).install();
    atatusInitialized = true;
    window.atatusInitialized = true;
    window.atatusInstance = atatus; // Make atatus globally available
    console.log('✅ Atatus monitoring initialized successfully');
    
    // Set user context
    setTimeout(() => {
      setAtatusUser({
        id: 'anonymous-user',
        email: 'anonymous@example.com',
        name: 'Anonymous User'
      });
    }, 100);
  } else {
    console.warn('⚠️ Atatus license key not found or Atatus not available');
  }
} catch (error) {
  console.error('❌ Failed to initialize Atatus:', error);
  atatusInitialized = false;
  window.atatusInitialized = false;
}

// Render the React app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Custom Service Worker Registration
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      // Handle GitHub Pages deployment with custom domain or project path
      const baseUrl = import.meta.env.BASE_URL || '/';
      const swUrl = `${baseUrl}service-worker.js`;
      
      console.log(`Attempting to register Service Worker at: ${swUrl}`);

      navigator.serviceWorker.register(swUrl)
        .then(registration => {
          console.log('✅ Service Worker registered successfully:', registration);
          console.log('Real events cached for offline use');

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) return;
            
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('🔄 New content available; please refresh.');
                  // Optional: Add UI notification to prompt user to refresh
                } else {
                  console.log('📦 Content is cached for offline use.');
                }
              }
            };
          };
        })
        .catch(error => {
          console.error('❌ Service Worker registration failed:', error);
          
          // If registration fails, ensure no broken SW is left behind
          navigator.serviceWorker.ready.then(registration => {
            registration?.unregister().then(() => {
              console.log('🧹 Cleaned up previous Service Worker registration');
            });
          });
        });
    });
  }
};

// Register service worker in production
registerServiceWorker();

// Development-only Atatus test
if (import.meta.env.DEV && window.location.hostname === 'localhost') {
  setTimeout(() => {
    try {
      if (atatusInitialized) {
        safeNotify(new Error('Test Atatus Setup - Development Test'));
        console.log('🧪 Test error sent to Atatus');
      }
    } catch (error) {
      console.error('Failed to send test error:', error);
    }
  }, 2000);
}