import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Global Error Caught by Boundary:", error, errorInfo);
    this.setState({ errorInfo });
    window.__LAST_ERROR__ = {
      message: error?.message || String(error),
      stack: error?.stack,
      componentStack: errorInfo?.componentStack
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white p-6 flex flex-col items-center justify-center font-sans">
          <div className="max-w-2xl w-full bg-slate-850 p-6 rounded-2xl border border-rose-500/40 shadow-2xl bg-slate-800">
            <div className="flex items-center gap-2.5 text-rose-400 font-bold text-base mb-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              Runtime Application Error Detected
            </div>
            <p className="text-xs text-slate-300 mb-4">
              An error occurred during component rendering. You can reset your session or reload the application:
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-700/60 overflow-x-auto text-xs font-mono text-rose-300 max-h-72">
              <div><strong>Error:</strong> {this.state.error?.message || String(this.state.error)}</div>
              {this.state.error?.stack && (
                <pre className="mt-2 text-[11px] text-slate-400 whitespace-pre-wrap">{this.state.error.stack}</pre>
              )}
              {this.state.errorInfo?.componentStack && (
                <pre className="mt-2 text-[10px] text-blue-300 whitespace-pre-wrap border-t border-slate-800 pt-2">
                  Component Stack: {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>
            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={() => {
                  localStorage.removeItem("rvs_erp_current_user");
                  window.location.reload();
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition shadow-md"
              >
                Reset Session &amp; Sign Out
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-xl transition"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Window global uncaught error listener
if (typeof window !== "undefined") {
  window.addEventListener("error", (e) => {
    console.error("Window Uncaught Error:", e.error || e.message);
    window.__LAST_WINDOW_ERROR__ = {
      message: e.message,
      filename: e.filename,
      lineno: e.lineno,
      colno: e.colno,
      error: e.error?.toString()
    };
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
