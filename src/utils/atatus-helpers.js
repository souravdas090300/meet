// utils/atatus-helpers.js
import * as atatus from 'atatus-spa';

/**
 * Check if Atatus is properly initialized and available
 */
const isAtatusAvailable = () => {
  return typeof atatus !== 'undefined' && atatus !== null;
};

/**
 * Safe wrapper for Atatus breadcrumb function
 * Note: atatus-spa uses different method names than other Atatus SDKs
 */
export const safeAddBreadcrumb = (message, category = 'info') => {
  try {
    if (!isAtatusAvailable()) return;
    
    // Try different method names that might exist
    if (typeof atatus.addBreadcrumb === 'function') {
      atatus.addBreadcrumb(message, category);
    } else if (typeof atatus.leaveBreadcrumb === 'function') {
      atatus.leaveBreadcrumb(message, category);
    } else {
      // Fallback: just log to console in development
      if (import.meta.env.DEV) {
        console.log(`[Breadcrumb] ${category}: ${message}`);
      }
    }
  } catch (error) {
    console.warn('Failed to add breadcrumb to Atatus:', error);
  }
};

/**
 * Safe wrapper for Atatus notify function
 */
export const safeNotify = (error, options = {}) => {
  try {
    if (!isAtatusAvailable()) return;
    
    if (typeof atatus.notify === 'function') {
      atatus.notify(error, options);
    } else if (typeof atatus.captureException === 'function') {
      atatus.captureException(error, options);
    } else {
      // Fallback: just log to console
      console.error('Atatus Error:', error, options);
    }
  } catch (err) {
    console.warn('Failed to notify Atatus:', err);
  }
};

/**
 * Set user information in Atatus for better error tracking
 */
export const setAtatusUser = (user) => {
  try {
    if (!isAtatusAvailable()) return;
    
    if (typeof atatus.setUser === 'function') {
      atatus.setUser({
        id: user.id || user.email,
        email: user.email,
        name: user.name || user.displayName,
        plan: user.subscriptionPlan,
        signupDate: user.createdAt
      });
    } else {
      // Fallback: log user info in development
      if (import.meta.env.DEV) {
        console.log('[User Context]', user);
      }
    }
  } catch (error) {
    console.warn('Failed to set Atatus user:', error);
  }
};

/**
 * Add custom tags to Atatus
 */
export const addAtatusTag = (key, value) => {
  try {
    if (!isAtatusAvailable()) return;
    
    if (typeof atatus.setTag === 'function') {
      atatus.setTag(key, value);
    } else if (typeof atatus.addTags === 'function') {
      atatus.addTags({ [key]: value });
    } else {
      // Fallback: log tag in development
      if (import.meta.env.DEV) {
        console.log(`[Tag] ${key}: ${value}`);
      }
    }
  } catch (error) {
    console.warn('Failed to add Atatus tag:', error);
  }
};

/**
 * Log custom events to Atatus
 */
export const logAtatusEvent = (eventName, severity = 'info', properties = {}) => {
  try {
    if (!isAtatusAvailable()) return;
    
    if (typeof atatus.notify === 'function') {
      atatus.notify(new Error(`Custom Event: ${eventName}`), {
        severity: severity,
        customData: {
          eventType: 'custom',
          eventName,
          ...properties
        }
      });
    } else {
      // Fallback: log event info
      console.log(`[Event] ${eventName}:`, { severity, ...properties });
    }
  } catch (error) {
    console.warn('Failed to log Atatus event:', error);
  }
};

/**
 * Track page navigation
 */
export const trackPageView = (pageName, additionalData = {}) => {
  try {
    if (!isAtatusAvailable()) return;
    
    addAtatusTag('currentPage', pageName);
    
    // Set additional data as tags
    Object.entries(additionalData).forEach(([key, value]) => {
      addAtatusTag(key, value);
    });
  } catch (error) {
    console.warn('Failed to track page view:', error);
  }
};
