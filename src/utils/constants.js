/** Breakpoints kept in sync with `tailwind.config.js` `theme.screens`. */
export const BREAKPOINTS = {
  xs: 375,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1440,
  "3xl": 1920,
};

/**
 * Navigation switches to the mobile panel below the `lg` breakpoint.
 *
 * This used to be `md` (768px), which worked while the header wordmark was the
 * short "Simbha Ads". Widening the brand to "Sri Simbha Ad Solution" added
 * roughly 130px, and at 768–1023px the header could no longer fit the logo, the
 * wordmark, four nav links and the theme switch: "About Us" and "Contact Us"
 * wrapped onto two lines (48px -> 76px tall) and the theme switch was pushed
 * past the right edge of the viewport.
 *
 * Raising the switch to `lg` gives the desktop bar room to breathe, and a
 * tablet at 768–1023px is better served by the slide-in panel than by four
 * cramped links. The panel and the bar are mutually exclusive, so this costs
 * nothing at either size.
 */
export const MOBILE_NAV_BREAKPOINT = BREAKPOINTS.lg;

/** Slideshow shows a single slide below the `sm` breakpoint. */
export const SLIDESHOW_SINGLE_SLIDE_BREAKPOINT = BREAKPOINTS.sm;

export const AUTOPLAY_INTERVAL_MS = 5000;

export const THEME_STORAGE_KEY = "simbha-theme";
