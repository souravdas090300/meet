import React from 'react';
import { safeNotify } from '../utils/atatus-helpers';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log the error to Atatus
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
                <p><strong>Error:</strong> {this.state.error && this.state.error.toString()}</p>
                <p><strong>Component Stack:</strong> {this.state.errorInfo.componentStack}</p>
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
