import { cx } from "../../../utils/helpers";

/**
 * Accessible loading indicator.
 *
 * `role="status"` + visually hidden text means screen readers announce the
 * wait instead of the user staring at a silent spinner.
 */
const Loader = ({ label = "Loading", className, size = "md" }) => {
  const sizes = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-4",
    lg: "h-14 w-14 border-4",
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={cx(
        "flex flex-col items-center justify-center gap-3 py-10",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cx(
          "animate-spin rounded-full border-brand-500 border-t-transparent motion-reduce:animate-none",
          sizes[size]
        )}
      />
      <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
    </div>
  );
};

export default Loader;
