// utils/atatus-helpers.js
import * as atatus from 'atatus-spa';

/**
 * Check if Atatus is properly initialized and available
 */
const isAtatusAvailable = () => {
  return typeof atatus !== 'undefined' && atatus !== null;
};

/**
 * Safe wrapper for Atatus leaveBreadcrumb function
 */
export const safeAddBreadcrumb = (message, category = 'info') => {
  try {
    if (isAtatusAvailable() && typeof atatus.leaveBreadcrumb === 'function') {
      atatus.leaveBreadcrumb(message, category);
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
    if (isAtatusAvailable() && typeof atatus.notify === 'function') {
      atatus.notify(error, options);
    }
  } catch (err) {
    console.warn('Failed to notify Atatus:', err);
  }
};

/**
 * Set user information in Atatus for better error tracking
 * Call this after user login
 */
export const setAtatusUser = (user) => {
  try {
    if (isAtatusAvailable() && typeof atatus.setUser === 'function') {
      atatus.setUser({
        id: user.id || user.email,
        email: user.email,
        name: user.name || user.displayName,
        // Add any other user properties you want to track
        plan: user.subscriptionPlan,
        signupDate: user.createdAt
      });
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
    if (isAtatusAvailable() && typeof atatus.addTags === 'function') {
      atatus.addTags({
        [key]: value
      });
    }
  } catch (error) {
    console.warn('Failed to add Atatus tag:', error);
  }
};

/**
 * Log custom events to Atatus
 */
export const logAtatusEvent = (eventName, properties = {}) => {
  try {
    if (isAtatusAvailable() && typeof atatus.notify === 'function') {
      atatus.notify(new Error(`Custom Event: ${eventName}`), {
        severity: 'info',
        customData: {
          eventType: 'custom',
          eventName,
          ...properties
        }
      });
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
    if (isAtatusAvailable() && typeof atatus.addTags === 'function') {
      atatus.addTags({
        currentPage: pageName,
        ...additionalData
      });
    }
  } catch (error) {
    console.warn('Failed to track page view:', error);
  }
};
