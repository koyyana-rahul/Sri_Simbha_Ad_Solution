import { Component } from "react";

/**
 * Top-level React error boundary.
 *
 * Catches render/lifecycle errors anywhere below it, shows a friendly recovery
 * screen and — in development only — prints the component stack to the console.
 * The production UI never exposes a stack trace or error message to visitors.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error("Unhandled UI error:", error, errorInfo);
    }
    this.props.onError?.(error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    const { hasError } = this.state;
    const { children, fallbackTitle, fallbackMessage } = this.props;

    if (!hasError) return children;

    return (
      <div
        role="alert"
        className="flex min-h-viewport flex-col items-center justify-center gap-4 bg-white px-4 text-center text-gray-900 dark:bg-surface-dark dark:text-gray-100"
      >
        <p
          className="text-display font-extrabold text-brand-600 dark:text-brand-400"
          aria-hidden="true"
        >
          Oops!
        </p>
        <h1 className="text-xl font-semibold">
          {fallbackTitle || "Something went wrong."}
        </h1>
        <p className="max-w-md text-gray-700 dark:text-gray-300">
          {fallbackMessage ||
            "We could not load this part of the page. Please try again."}
        </p>
        <button
          type="button"
          onClick={this.handleReload}
          className="mt-2 rounded-pill bg-gradient-to-br from-brand-400 to-orange-500 px-6 py-2 font-semibold text-white shadow-md transition hover:shadow-lg"
        >
          Reload page
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
