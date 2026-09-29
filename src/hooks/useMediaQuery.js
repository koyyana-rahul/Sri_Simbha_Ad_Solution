import { useEffect, useState } from "react";

/**
 * Subscribes to a CSS media query.
 *
 * Uses `matchMedia` rather than a `resize` listener so it only fires when the
 * answer actually changes, and always removes its listener on unmount.
 *
 * @param {string} query e.g. `"(min-width: 768px)"`
 * @returns {boolean}
 */
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;

    const mediaQueryList = window.matchMedia(query);
    const handleChange = (event) => setMatches(event.matches);

    setMatches(mediaQueryList.matches);
    mediaQueryList.addEventListener("change", handleChange);

    return () => mediaQueryList.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
};

export default useMediaQuery;
