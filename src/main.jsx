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
    // For SPA applications, use atatus-spa which shouldn't register service workers
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

// Use custom service worker registration
import { register } from './serviceWorkerRegistration.js';

// Register service worker using custom registration
register({
  onSuccess(registration) {
    console.log('Service worker registered successfully:', registration);
    console.log('Real events cached for offline use');
  },
  onUpdate(registration) {
    console.log('New content available, please refresh', registration);
  }
});

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