// Atatus configuration
export const atatusConfig = {
  // Your Atatus license key from environment variables
  licenseKey: import.meta.env.VITE_ATATUS_LICENSE_KEY || '93a094075aa3483186cf248030fdad97',
  
  // Configuration options
  options: {
    appName: import.meta.env.VITE_APP_NAME || 'Meet App',
    appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
    
    // Performance monitoring
    enablePerformanceMonitoring: true,
    enableUserInteractions: true,
    enableErrorTracking: true,
    
    // Custom tags based on environment
    tags: {
      environment: import.meta.env.VITE_ENVIRONMENT || (import.meta.env.PROD ? 'production' : 'development'),
      framework: 'React',
      buildTool: 'Vite',
      version: import.meta.env.VITE_APP_VERSION || '1.0.0'
    },
    
    // Error filtering
    beforeSend: function(data) {
      // Don't send errors in development unless explicitly enabled
      if (import.meta.env.DEV && !import.meta.env.VITE_ATATUS_DEV_ENABLED) {
        return false;
      }
      
      // Filter out specific error messages
      const unwantedErrors = [
        'Script error',
        'Network request failed',
        'Non-Error promise rejection captured'
      ];
      
      if (data.message && unwantedErrors.some(error => data.message.includes(error))) {
        return false;
      }
      
      return data;
    },
    
    // Custom data
    customData: {
      buildTime: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }
  }
};
