// utils/atatus-helpers.js
import * as atatus from 'atatus-spa';

// Helper function to get atatus instance safely
const getAtatusInstance = () => {
  // Try imported atatus first, then global window reference
  return atatus || window.atatusInstance || null;
};

export const safeAddBreadcrumb = (message, level = 'info', data = {}) => {
  try {
    // Since atatus-spa might not have addBreadcrumb, just log to console
    // This prevents the "$e.addBreadcrumb is not a function" error
    console.log(`[Breadcrumb] ${level}: ${message}`, data);
  } catch (error) {
    console.error('Failed to add breadcrumb:', error);
  }
};

export const safeNotify = (error, options = {}) => {
  try {
    const atatusInstance = getAtatusInstance();
    if (atatusInstance && typeof atatusInstance.notify === 'function') {
      atatusInstance.notify(error, options);
    } else {
      console.error('Atatus Error (fallback):', error, options);
    }
  } catch (err) {
    console.error('Failed to notify Atatus:', err);
  }
};

export const setAtatusUser = (user) => {
  try {
    const atatusInstance = getAtatusInstance();
    if (atatusInstance && typeof atatusInstance.setUser === 'function') {
      atatusInstance.setUser(user);
    } else {
      console.log('User context (fallback):', user);
    }
  } catch (error) {
    console.error('Failed to set Atatus user:', error);
  }
};

// Additional helper functions for compatibility
export const logAtatusEvent = (eventName, severity = 'info', properties = {}) => {
  try {
    const atatusInstance = getAtatusInstance();
    if (atatusInstance && typeof atatusInstance.notify === 'function') {
      atatusInstance.notify(new Error(`Custom Event: ${eventName}`), {
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
    const atatusInstance = getAtatusInstance();
    if (atatusInstance && typeof atatusInstance.setTag === 'function') {
      atatusInstance.setTag('currentPage', pageName);
      Object.entries(additionalData).forEach(([key, value]) => {
        atatusInstance.setTag(key, value);
      });
    } else {
      console.log(`[Page View] ${pageName}:`, additionalData);
    }
  } catch (error) {
    console.error('Failed to track page view:', error);
  }
};
