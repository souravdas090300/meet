import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = '/meet/sw.js';
    
    navigator.serviceWorker.register(swUrl, { scope: '/meet/' })
      .then((registration) => {
        console.log('Service Worker successfully registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('Error during service worker registration:', error);
      });
  });
}