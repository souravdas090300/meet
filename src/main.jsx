import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import * as atatus from 'atatus-spa';
import { safeAddBreadcrumb, safeNotify, setAtatusUser } from './utils/atatus-helpers.js';

// Initialize Atatus with proper error handling
let atatusInitialized = false;
try {
  atatus.config('93a094075aa3483186cf248030fdad97').install();
  atatusInitialized = true;
  console.log('✅ Atatus monitoring initialized successfully');
  
  // Set user context for better tracking using safe helper
  setAtatusUser({
    id: 'anonymous-user',
    email: 'anonymous@example.com',
    name: 'Anonymous User'
  });
  
} catch (error) {
  console.error('❌ Failed to initialize Atatus:', error);
  atatusInitialized = false;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Test Atatus integration in development only
if (import.meta.env.DEV && window.location.hostname === 'localhost') {
  // Wait a bit for Atatus to initialize, then send a test error
  setTimeout(() => {
    try {
      if (atatusInitialized) {
        safeNotify(new Error('Test Atatus Setup - This is a test error from development'));
        console.log('🧪 Test error sent to Atatus dashboard');
      } else {
        console.warn('Atatus not properly initialized - skipping test error');
      }
    } catch (error) {
      console.error('Failed to send test error:', error);
    }
  }, 2000);
}

// Service Worker Registration for PWA - only in production
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker successfully registered:', registration.scope);
        // Track successful service worker registration
        if (atatusInitialized) {
          safeAddBreadcrumb('Service Worker registered successfully', 'info');
        }
      })
      .catch(error => {
        console.error('❌ Service Worker registration failed:', error);
        // Track service worker registration errors
        if (atatusInitialized) {
          safeNotify(error, {
            context: 'Service Worker Registration',
            severity: 'warning'
          });
        }
      });
  });
}
