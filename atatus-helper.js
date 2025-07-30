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