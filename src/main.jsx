import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import * as atatus from 'atatus-spa';

// Initialize Atatus - replace with your actual config code from Atatus dashboard
atatus.config('93a094075aa3483186cf248030fdad97').install();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Test Atatus integration - this should appear in your Atatus dashboard
atatus.notify(new Error('Test Atatus Setup'));

// Service Worker Registration for PWA - only in production
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker successfully registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Error during service worker registration:', error);
      });
  });
}
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker successfully registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Error during service worker registration:', error);
      });
  });
}
