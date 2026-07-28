import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
          <h2>Something went wrong</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>An unexpected error occurred in the dashboard.</p>
          <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '16px', borderRadius: '8px', maxWidth: '600px', width: '100%', overflowX: 'auto', fontFamily: 'monospace' }}>
            {this.state.error?.toString()}
          </div>
          <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={() => window.location.reload()}>
            Reload Dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
