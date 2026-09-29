import { isRouteErrorResponse, useRouteError } from "react-router-dom";

import Button from "../../components/common/Button/Button";
import DecorativeBlobs from "../../components/common/DecorativeBlobs/DecorativeBlobs";
import Seo from "../../components/common/Seo/Seo";

/**
 * Router `errorElement`.
 *
 * Renders whenever a route loader throws or a route fails to match. Unlike the
 * React `ErrorBoundary`, this is a route-level screen, so it is intentionally
 * kept separate.
 *
 * Only the HTTP status / status text is shown — internal error messages and
 * stack traces are logged to the console in development and never rendered.
 */
const RouteError = () => {
  const error = useRouteError();

  const isResponse = isRouteErrorResponse(error);
  const status = isResponse ? error.status : 500;
  const statusText = isResponse
    ? error.statusText || "Unexpected Error"
    : "Unexpected Error";

  if (process.env.NODE_ENV !== "production" && !isResponse) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  const isNotFound = status === 404;

  return (
    <section className="relative flex min-h-viewport items-center justify-center overflow-hidden bg-white px-4 py-20 text-gray-900 dark:bg-surface-dark dark:text-gray-100">
      <Seo
        title={isNotFound ? "Page not found" : "Something went wrong"}
        description="An unexpected error occurred."
        path="/error"
        noIndex
      />

      <DecorativeBlobs />

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-brand-100 bg-white p-8 text-center shadow-xl backdrop-blur-sm dark:border-brand-900 dark:bg-gray-800 sm:p-10">
        <h1 className="mb-4 text-display font-extrabold text-brand-600 dark:text-brand-400">
          Oops!
        </h1>
        <h2 className="mb-4 text-xl font-semibold">
          {isNotFound ? "We couldn't find that page." : "Something went wrong."}
        </h2>
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          {isNotFound
            ? "The page may have been moved or removed. Use the links below to get back on track."
            : "We couldn’t process your request. But don’t worry, you can try again or go back to safety."}
        </p>

        <p className="mb-6 rounded-xl border border-brand-100 bg-brand-50 p-4 text-sm text-gray-800 shadow-inner dark:border-brand-900 dark:bg-brand-950/20 dark:text-gray-200">
          <strong>Status:</strong> {status}
          <br />
          <strong>Message:</strong> {statusText}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            type="button"
            variant="gradient"
            onClick={() => window.location.reload()}
          >
            Reload page
          </Button>
          <Button as="a" href="/" variant="ghost">
            Go to home
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RouteError;
