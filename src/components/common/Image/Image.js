import { useState } from "react";
import { cx } from "../../../utils/helpers";

/**
 * Responsive `<img>` with:
 *  - lazy loading by default (opt out with `priority` for LCP images)
 *  - async decoding so images never block the main thread
 *  - an explicit `aspect-ratio` so the box is reserved before the file loads,
 *    which prevents layout shift
 *  - a graceful visual fallback if the file fails to load
 */
const Image = ({
  src,
  alt,
  width,
  height,
  priority = false,
  ratio = "1 / 1",
  wrapperClassName,
  className,
  fallbackClassName = "bg-gray-200 dark:bg-gray-800",
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cx(
          "flex h-full w-full items-center justify-center",
          fallbackClassName,
          wrapperClassName
        )}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      onError={() => setHasError(true)}
      style={{ aspectRatio: width && height ? undefined : ratio }}
      className={cx("h-full w-full object-cover", className)}
      {...rest}
    />
  );
};

export default Image;
