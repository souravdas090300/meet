const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.0/8 are considered localhost for IPv4.
      window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
  );
  
export function register(config) {
  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        // Use the correct base path and filename for service worker
        // Detect if we're on Vercel (vercel.app domain) or GitHub Pages (github.io)
        const isVercel = window.location.hostname.includes('vercel.app');
        const isGitHubPages = window.location.hostname.includes('github.io');
        const basePath = import.meta.env.DEV || isVercel ? '/' : '/meet/';
        const swUrl = `${basePath}service-worker.js`;          if (isLocalhost) {
            // Check if a service worker still exists or not.
            checkValidServiceWorker(swUrl, config);
    
            navigator.serviceWorker.ready.then(() => {
              console.log(
                'This web app is being served cache-first by a service ' +
                  'worker. To learn more, visit https://cra.link/PWA'
              );
            });
          } else {
            // Register the service worker for production builds
            registerValidSW(swUrl, config);
          }
        });
      }
  }
  
  function registerValidSW(swUrl, config) {
    // Detect if we're on Vercel (vercel.app domain) or GitHub Pages (github.io)
    const isVercel = window.location.hostname.includes('vercel.app');
    const isGitHubPages = window.location.hostname.includes('github.io');
    const basePath = import.meta.env.DEV || isVercel ? '/' : '/meet/';
    navigator.serviceWorker
      .register(swUrl, { scope: basePath })
      .then((registration) => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) {
            return;
          }
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // At this point, the updated precached content has been fetched,
                // but the previous service worker will still serve the older
                // content until all client tabs are closed.
                console.log(
                  'New content is available and will be used when all ' +
                    'tabs for this page are closed. See https://cra.link/PWA.'
                );
  
                // Execute callback
                if (config && config.onUpdate) {
                  config.onUpdate(registration);
                }
              } else {
                // At this point, everything has been precached.
                // It's the perfect time to display a
                // "Content is cached for offline use." message.
                console.log('Content is cached for offline use.');
  
                // Execute callback
                if (config && config.onSuccess) {
                  config.onSuccess(registration);
                }
              }
            }
          };
        };
      })
      .catch((error) => {
        console.error('Error during service worker registration:', error);
      });
  }
  
  function checkValidServiceWorker(swUrl, config) {
    // Check if the service worker can be found. If it can't reload the page.
    fetch(swUrl, {
      headers: { 'Service-Worker': 'script' },
    })
      .then((response) => {
        // Ensure service worker exists, and that we really are getting a JS file.
        const contentType = response.headers.get('content-type');
        if (
          response.status === 404 ||
          (contentType != null && contentType.indexOf('javascript') === -1)
        ) {
          // No service worker found. Probably a different app. Reload the page.
          navigator.serviceWorker.ready.then((registration) => {
            registration.unregister().then(() => {
              window.location.reload();
            });
          });
        } else {
          // Service worker found. Proceed as normal.
          registerValidSW(swUrl, config);
        }
      })
      .catch(() => {
        console.log('No internet connection found. App is running in offline mode.');
      });
  }
  
  export function unregister() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.unregister();
        })
        .catch((error) => {
          console.error(error.message);
        });
    }
  }