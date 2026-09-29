import { MotionConfig } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import ErrorBoundary from "../components/common/ErrorBoundary/ErrorBoundary";
import ThemeProvider from "./ThemeProvider";

/**
 * Application providers.
 *
 * `MotionConfig reducedMotion="user"` makes every framer-motion animation in
 * the app honour the visitor's `prefers-reduced-motion` setting in one place,
 * instead of each component having to check for it.
 */
export const AppProviders = ({ children }) => (
  <>
    <Analytics />
    <SpeedInsights />

    <ErrorBoundary>
      <ThemeProvider>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </ThemeProvider>
    </ErrorBoundary>
  </>
);

export default AppProviders;
