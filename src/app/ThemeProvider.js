import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { THEME_STORAGE_KEY } from "../utils/constants";

const ThemeContext = createContext(null);

/**
 * The only two valid themes.
 *
 * There is deliberately no "system" / "auto" / "monitor" value. Anything that
 * is not one of these two is invalid and falls back to `DEFAULT_THEME`, so a
 * value left behind by an older build (or hand-edited in devtools) can never
 * put the app into a state it has no rendering for.
 */
const THEMES = ["light", "dark"];

/** Dark is the site's established default and its historical look. */
const DEFAULT_THEME = "dark";

const isTheme = (value) => THEMES.includes(value);

/**
 * Browser chrome colour per theme.
 *
 * Kept in step with the real surfaces: the light header is brand amber, the
 * dark header is the dark surface. A fixed amber `theme-color` in dark mode
 * paints a bright yellow strip above a near-black header on iOS and Android.
 */
const THEME_COLORS = { light: "#f59e0b", dark: "#111827" };

/**
 * Global theme provider — light or dark, and nothing else.
 *
 * Responsibilities:
 *  - exactly two states, `light` and `dark`, resolved through
 *    `readStoredTheme` so an invalid or absent value always yields a usable
 *    theme
 *  - persistence to `localStorage`, best-effort: a browser with storage
 *    disabled still themes correctly, it just does not remember
 *  - `storage`-event sync so a second tab follows a change made in the first
 *  - `color-scheme` and `theme-color` kept in step, so native controls, form
 *    fields, scrollbars and the mobile browser chrome match the surface
 *  - a short colour transition on *changes only*, never on first load
 *
 * The class is applied before React mounts by the inline script in
 * `index.html`, which reads the same key and the same two values, so there is
 * no flash of the wrong theme.
 */
export const ThemeProvider = ({ children, defaultTheme = DEFAULT_THEME }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return defaultTheme;

    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (isTheme(stored)) return stored;
    } catch {
      // Private mode / storage disabled: fall through to the default.
    }

    return isTheme(defaultTheme) ? defaultTheme : DEFAULT_THEME;
  });

  useEffect(() => {
    if (typeof document === "undefined") return undefined;

    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;

    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute("content", THEME_COLORS[theme] ?? THEME_COLORS.dark);

    // Opt into the transition only from the second render onwards, so the
    // first paint — which the inline script already got right — never animates.
    const raf = window.requestAnimationFrame(() => {
      root.setAttribute("data-theme-transition", "true");
    });

    return () => {
      window.cancelAnimationFrame(raf);
      root.removeAttribute("data-theme-transition");
    };
  }, [theme]);

  /**
   * Normalise an invalid stored value.
   *
   * The inline pre-paint script already rewrites anything that is not
   * `light`/`dark`, but storage can be unavailable to it and available by the
   * time React mounts (some privacy modes fail only the earliest reads), so the
   * guarantee is repeated here. No-op on the normal path.
   */
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (stored !== null && !isTheme(stored)) {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
      }
    } catch {
      // Best-effort only.
    }
  }, [theme]);

  // Persist on *changes* only, never on mount: the initialiser has already
  // read the stored value, so writing it back would be a no-op, and skipping
  // it removes a race where another tab's newer choice gets overwritten.
  const hasPersisted = useRef(false);
  useEffect(() => {
    if (!hasPersisted.current) {
      hasPersisted.current = true;
      return;
    }

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Persisting is best-effort only.
    }
  }, [theme]);

  /**
   * Cross-tab sync.
   *
   * The `storage` event only fires in *other* tabs, so this cannot loop.
   */
  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleStorage = (event) => {
      if (event.key !== THEME_STORAGE_KEY) return;
      // An invalid value in another tab is ignored rather than applied.
      if (!isTheme(event.newValue)) return;
      setTheme(event.newValue);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((previous) => (previous === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a <ThemeProvider>.");
  }
  return context;
};

export default ThemeProvider;
