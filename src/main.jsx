import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './App.css';
import * as atatus from 'atatus-spa';
import { safeNotify, setAtatusUser } from './utils/atatus-helpers.js';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Initialize Atatus with proper error handling
let atatusInitialized = false;
window.atatusInitialized = false; // Make it globally available

try {
  const licenseKey = import.meta.env.VITE_ATATUS_LICENSE_KEY || '93a094075aa3483186cf248030fdad97';

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

// Register service worker
if (typeof serviceWorkerRegistration.register === 'function') {
  serviceWorkerRegistration.register();
} else {
  console.warn('Service worker registration function not available');
}

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