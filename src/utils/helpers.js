/** Generic, framework-agnostic helpers. Kept dependency-free so they are cheap to unit test. */

/**
 * Splits a "Title: detail" string into its two parts.
 * Used by the service pages where benefits are stored as a single string.
 *
 * @param {string} value
 * @returns {{ title: string, detail: string }}
 */
export const splitTitleDetail = (value = "") => {
  const [title, ...rest] = value.split(":");
  const detail = rest.join(":");
  return {
    title: title.trim(),
    detail: detail.trim(),
  };
};

/**
 * Wraps an index into the `[0, length)` range so navigation can loop forever.
 */
export const wrapIndex = (index, length) =>
  length === 0 ? 0 : ((index % length) + length) % length;

/**
 * Returns `length` consecutive items of `items` starting at `start`, wrapping
 * around the end. Used by the slideshow to show 1 or 2 slides at a time.
 */
export const getCircularWindow = (items, start, length) => {
  if (!items.length) return [];
  return Array.from(
    { length },
    (_, offset) => items[wrapIndex(start + offset, items.length)]
  );
};

/**
 * Joins class names, dropping falsy values.
 */
export const cx = (...classes) => classes.filter(Boolean).join(" ");

/**
 * Triggers a client-side navigation back to the top of the document.
 */
export const scrollToTop = (behavior = "smooth") => {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: 0, left: 0, behavior });
};
