import React from 'react';
import { safeNotify } from '../utils/atatus-helpers.js';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

<<<<<<< Updated upstream
  static getDerivedStateFromError() {
=======
  static getDerivedStateFromError(error) {
>>>>>>> Stashed changes
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Update state with error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log the error to Atatus if available
    safeNotify(error, {
      severity: 'error',
      customData: {
        errorBoundary: true,
        componentStack: errorInfo.componentStack,
        errorStack: error.stack
      }
    });

    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h2>Oops! Something went wrong.</h2>
            <p>We're sorry for the inconvenience. The error has been reported and we're working on a fix.</p>
            <button 
              onClick={() => window.location.reload()}
              className="error-boundary-button"
            >
              Reload Page
            </button>
            {process.env.NODE_ENV === 'development' && (
              <details style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>
                <summary>Error Details (Development Only)</summary>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
