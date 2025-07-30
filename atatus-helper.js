// utils/atatus-helpers.js
import * as atatus from 'atatus-spa';

export const safeAddBreadcrumb = (message, level = 'info', data = {}) => {
  try {
    if (typeof atatus !== 'undefined' && atatus.addBreadcrumb) {
      atatus.addBreadcrumb({
        message,
        category: 'app',
        level,
        data
      });
    } else {
      console.warn('Atatus not available for breadcrumb:', message);
    }
  } catch (error) {
    console.error('Failed to add breadcrumb:', error);
  }
};

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