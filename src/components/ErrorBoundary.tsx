import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Reusable Error Boundary component
 * DRY: Single error boundary for all components
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="text-center py-12 px-4">
          <p className="text-gray-400 mb-2">Something went wrong</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="text-sm text-green-500 hover:text-green-400"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
