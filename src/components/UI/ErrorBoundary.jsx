import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: '#1a1a1a', color: 'red', fontFamily: 'monospace' }}>
          <h2>Application Crash</h2>
          <p>{this.state.error && this.state.error.toString()}</p>
          <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
          <pre>{this.state.error && this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
