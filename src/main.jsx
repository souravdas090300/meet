import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './index.css';
import * as atatus from 'atatus-spa';
import { safeNotify, setAtatusUser } from './utils/atatus-helpers.js';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Initialize Atatus with proper error handling
let atatusInitialized = false;
window.atatusInitialized = false; // Make it globally available

try {
  const licenseKey = import.meta.env.VITE_ATATUS_LICENSE_KEY || '93a094075aa3483186cf248030fdad97';

  ReactDOM.createRoot(document.getElementById('root')).render(
 <React.StrictMode>
   <App />
 </React.StrictMode>,
);
serviceWorkerRegistration.register();

  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator)
  
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Test Atatus in development
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

// Service Worker Registration (Production Only)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration.scope);
        // Removed safeAddBreadcrumb call to fix "$e.addBreadcrumb is not a function" error
      })
      .catch(error => {
        console.error('❌ Service Worker failed:', error);
        if (atatusInitialized) {
          safeNotify(error, {
            context: 'Service Worker Registration',
            severity: 'warning'
          });
        }
      });
  });
}