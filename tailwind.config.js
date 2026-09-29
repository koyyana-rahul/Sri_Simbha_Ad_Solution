/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    // Breakpoints are extended (not replaced) so the default responsive scale
    // keeps working while the project gains an explicit `xs` tier for the
    // 320px range and a `3xl` tier for very large displays.
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
      "3xl": "1920px",
    },
    extend: {
      colors: {
        brand: {
          50: "#fffbe6",
          100: "#fef9e7",
          200: "#fff1c1",
          300: "#fde68a",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
        },
        /*
         * Surfaces. `surface` is the page background; the numbered steps are
         * the dark-mode elevation ladder from `styles/variables.css`
         * (`--color-surface`, `--color-surface-1`, `--color-surface-2`), so a
         * component can be one step above the page without hardcoding a hex in
         * both themes.
         */
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f9fafb",
          dark: "#0b1120",
          raised: "#131c31",
          overlay: "#1e293b",
        },
      },
      fontFamily: {
        inter: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      borderRadius: {
        sm: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        pill: "9999px",
      },
      maxWidth: {
        container: "72rem",
      },
      zIndex: {
        // `header` / `floating` are referenced as `z-header` / `z-floating`.
        // The modal layer is expressed as an arbitrary `z-[60]` in one place
        // and declared here as documentation of the scale.
        header: "50",
        modal: "60",
        floating: "70",
      },
    },
  },
  plugins: [],
};
