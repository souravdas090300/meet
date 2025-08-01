# PWA Testing Guide

## Overview
This guide outlines how to test the Progressive Web App (PWA) functionality of the Meet app.

## Testing Checklist

### 1. Installation Testing
- [ ] Open the app in a supported browser (Chrome, Edge, Firefox)
- [ ] Look for the install prompt in the address bar
- [ ] Click "Install" and verify the app installs as a standalone application
- [ ] Check that the app appears in the applications menu/start menu

### 2. Offline Functionality Testing
- [ ] Load the app while online and verify events are displayed
- [ ] Disconnect from the internet (disable network connection)
- [ ] Refresh the app and verify it still loads
- [ ] Check that cached events are still displayed
- [ ] Verify the warning alert appears: "You are offline. Events displayed may not be up to date."
- [ ] Reconnect to the internet and verify the warning disappears

### 3. Service Worker Testing
- [ ] Open Chrome DevTools → Application → Service Workers
- [ ] Verify the service worker is registered and running
- [ ] Check that files are precached in the Cache Storage
- [ ] Test that the app loads instantly on subsequent visits

### 4. Manifest Testing
- [ ] Open Chrome DevTools → Application → Manifest
- [ ] Verify all manifest properties are correctly displayed
- [ ] Check that icons are properly loaded
- [ ] Verify the app can be added to home screen on mobile devices

### 5. Responsive Design Testing
- [ ] Test the app on different screen sizes
- [ ] Verify it works well in standalone mode
- [ ] Check that the app adapts to portrait and landscape orientations

### 6. Performance Testing
- [ ] Use Lighthouse to audit the PWA
- [ ] Aim for PWA score of 100
- [ ] Check performance metrics
- [ ] Verify accessibility standards are met

## Expected Results

### PWA Features
✅ **Installable**: App can be installed from browser  
✅ **Offline Capable**: Works without internet connection  
✅ **App-like**: Runs in standalone mode without browser UI  
✅ **Responsive**: Adapts to different screen sizes  
✅ **Secure**: Served over HTTPS  
✅ **Fast**: Quick loading with service worker caching  

### User Experience
- Seamless installation process
- Instant loading after first visit
- Graceful offline experience with cached content
- Clear user feedback about online/offline status
- Native app-like feel and behavior

## Troubleshooting

### Installation Issues
- Ensure the app is served over HTTPS
- Check that manifest.json is properly configured
- Verify service worker is registered successfully

### Offline Issues
- Check localStorage for cached events
- Verify service worker is caching resources correctly
- Ensure offline detection is working properly

### Performance Issues
- Optimize images and assets
- Review service worker caching strategy
- Minimize JavaScript bundle size
