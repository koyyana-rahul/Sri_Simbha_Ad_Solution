import useMediaQuery from "./useMediaQuery";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * True when the user has asked the OS to minimise motion.
 *
 * Every looping animation in the app (marquee, gradient text, autoplaying
 * slideshow, background video) consults this so the site stays usable for
 * motion-sensitive visitors.
 *
 * @returns {boolean}
 */
const usePrefersReducedMotion = () => useMediaQuery(REDUCED_MOTION_QUERY);

export default usePrefersReducedMotion;
