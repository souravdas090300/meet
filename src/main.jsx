import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Initialize React app
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Service Worker Registration
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    const publicUrl = new URL(import.meta.env.BASE_URL, window.location.href);
    
    // Only register if we're on the same origin
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${import.meta.env.BASE_URL}sw.js`;

      navigator.serviceWorker.register(swUrl)
        .then(registration => {
          console.log('Service Worker successfully registered');

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) {
              return;
            }
            
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('New content available; please refresh.');
                } else {
                  console.log('Content is cached for offline use.');
                }
              }
            };
          };
        })
        .catch(error => {
          console.error('Error during service worker registration:', error);
        });
    });
  }
};

// Handle OAuth callback if we're on the redirect page
const handleOAuthCallback = () => {
  if (window.location.pathname.startsWith('/meet/')) {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    
    if (code) {
      console.log('OAuth code received:', code);
      // Here you would typically send this code to your backend
      // For testing purposes, you might want to display it:
      const codeDisplay = document.createElement('div');
      codeDisplay.style.position = 'fixed';
      codeDisplay.style.bottom = '20px';
      codeDisplay.style.right = '20px';
      codeDisplay.style.backgroundColor = '#f0f0f0';
      codeDisplay.style.padding = '10px';
      codeDisplay.style.borderRadius = '5px';
      codeDisplay.style.zIndex = '1000';
      codeDisplay.textContent = `OAuth Code: ${code}`;
      document.body.appendChild(codeDisplay);
    }
  }
};

// Initialize everything
const init = () => {
  registerServiceWorker();
  handleOAuthCallback();
};

// Start the app
init();