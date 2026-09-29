import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { cx } from "../../../utils/helpers";

const VARIANTS = {
  primary:
    "bg-brand-400 hover:bg-brand-500 text-white shadow-lg focus-visible:outline-brand-600",
  gradient:
    "bg-gradient-to-br from-brand-400 to-orange-500 hover:from-brand-500 hover:to-orange-600 text-white shadow-md hover:shadow-lg",
  outline:
    "border-2 border-brand-500 text-brand-600 dark:text-brand-400 hover:bg-brand-500 hover:text-white",
  ghost:
    "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
};

const SIZES = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm sm:text-base",
  lg: "px-8 py-3.5 text-base",
};

/**
 * The one button in the design system.
 *
 * Renders a real `<button>`, or a react-router `<Link>` / `<a>` when `to` /
 * `href` is supplied — which keeps interactive markup free of nested
 * `<button>`-inside-`<a>` (an accessibility and HTML-validity problem in the
 * original services CTA).
 */
const Button = forwardRef(
  (
    {
      as,
      to,
      href,
      variant = "primary",
      size = "md",
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const Component = as || (to ? Link : href ? "a" : "button");

    const isNativeButton = Component === "button";

    return (
      <Component
        ref={ref}
        to={to}
        href={href}
        type={isNativeButton ? "button" : undefined}
        className={cx(
          "inline-flex items-center justify-center gap-2 rounded-pill font-semibold",
          "transition duration-300 ease-standard",
          "hover:scale-105 active:scale-95 motion-reduce:hover:scale-100",
          VARIANTS[variant],
          SIZES[size],
          className
        )}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

Button.displayName = "Button";

export default Button;
