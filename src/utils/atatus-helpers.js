// utils/atatus-helpers.js
import * as atatus from 'atatus-spa';

/**
 * Set user information in Atatus for better error tracking
 * Call this after user login
 */
export const setAtatusUser = (user) => {
  atatus.setUser({
    id: user.id || user.email,
    email: user.email,
    name: user.name || user.displayName,
    // Add any other user properties you want to track
    plan: user.subscriptionPlan,
    signupDate: user.createdAt
  });
};

/**
 * Add custom tags to Atatus
 */
export const addAtatusTag = (key, value) => {
  atatus.addTags({
    [key]: value
  });
};

/**
 * Log custom events to Atatus
 */
export const logAtatusEvent = (eventName, properties = {}) => {
  atatus.notify(new Error(`Custom Event: ${eventName}`), {
    severity: 'info',
    customData: {
      eventType: 'custom',
      eventName,
      ...properties
    }
  });
};

/**
 * Track page navigation
 */
export const trackPageView = (pageName, additionalData = {}) => {
  atatus.addTags({
    currentPage: pageName,
    ...additionalData
  });
};
