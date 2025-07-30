// utils/atatus-helpers.js
import * as atatus from 'atatus-spa';

// REMOVED: safeAddBreadcrumb function completely to fix "$e.addBreadcrumb is not a function" error
// Breadcrumbs are not essential for the app functionality

export const safeNotify = (error, options = {}) => {
  try {
    if (typeof atatus !== 'undefined' && atatus.notify) {
      atatus.notify(error, options);
    } else {
      console.warn('Atatus not available for error:', error);
    }
  } catch (err) {
    console.error('Failed to notify Atatus:', err);
  }
};

export const setAtatusUser = (user) => {
  try {
    if (typeof atatus !== 'undefined' && atatus.setUser) {
      atatus.setUser(user);
    }
  } catch (error) {
    console.error('Failed to set Atatus user:', error);
  }
};

// Additional helper functions that are imported by other files
export const logAtatusEvent = (eventName, severity = 'info', properties = {}) => {
  try {
    if (typeof atatus !== 'undefined' && atatus.notify) {
      atatus.notify(new Error(`Custom Event: ${eventName}`), {
        severity: severity,
        customData: {
          eventType: 'custom',
          eventName,
          ...properties
        }
      });
    } else {
      console.log(`[Event] ${eventName}:`, { severity, ...properties });
    }
  } catch (error) {
    console.error('Failed to log Atatus event:', error);
  }
};

export const trackPageView = (pageName, additionalData = {}) => {
  try {
    if (typeof atatus !== 'undefined' && atatus.setTag) {
      atatus.setTag('currentPage', pageName);
      Object.entries(additionalData).forEach(([key, value]) => {
        atatus.setTag(key, value);
      });
    } else {
      console.log(`[Page View] ${pageName}:`, additionalData);
    }
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
};