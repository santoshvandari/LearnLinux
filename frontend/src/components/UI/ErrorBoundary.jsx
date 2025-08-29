// Error handling wrapper
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Terminal Error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Report error to monitoring service if available
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, errorId } = this.state;
      
      return (
        <div className="error-boundary">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Terminal Error</h2>
            <p className="mb-4 text-red-200">
              Something went wrong with the terminal interface.
            </p>
            
            {this.props.showDetails && error && (
              <details className="mb-4 text-left bg-red-800 p-4 rounded">
                <summary className="cursor-pointer font-semibold mb-2">
                  Error Details (ID: {errorId})
                </summary>
                <div className="text-sm font-mono">
                  <p className="mb-2"><strong>Error:</strong> {error.toString()}</p>
                  {errorInfo && errorInfo.componentStack && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap text-xs mt-1">
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
            
            <div className="space-x-4">
              <button 
                onClick={this.handleRetry}
                className="bg-red-700 hover:bg-red-600 text-white px-6 py-2 rounded transition-colors"
              >
                Try Again
              </button>
              <button 
                onClick={this.handleReload}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded transition-colors"
              >
                Reload Page
              </button>
            </div>
            
            <p className="mt-4 text-sm text-red-300">
              If this problem persists, please refresh the page or contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;