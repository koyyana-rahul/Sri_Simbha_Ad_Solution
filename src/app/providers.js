import { MotionConfig } from "framer-motion";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import ErrorBoundary from "../components/common/ErrorBoundary/ErrorBoundary";
import ThemeProvider from "./ThemeProvider";

/**
 * Vercel telemetry is mounted only in production builds.
 *
 * Both SDKs deliberately load a `script.debug.js` in development and still POST
 * to `/_vercel/insights/view` and `/_vercel/speed-insights/vitals`, which shows
 * up in the dev console and counts localhost traffic against the production
 * numbers. The SDKs detect the environment themselves, but the "debug" mode is
 * the point of them in development — so rather than fight the SDK, the mount
 * point is gated here: the components are simply not rendered while developing.
 *
 * The alternative — reading the SDK's own `isDevelopment()` — is not part of
 * its public API and would couple us to internals. `process.env.NODE_ENV` is
 * substituted at build time by DefinePlugin, so the dead branch is removed
 * entirely from the production bundle.
 */
const isProduction = process.env.NODE_ENV === "production";

/**
 * Application providers.
 *
 * `MotionConfig reducedMotion="user"` makes every framer-motion animation in
 * the app honour the visitor's `prefers-reduced-motion` setting in one place,
 * instead of each component having to check for it.
 */
export const AppProviders = ({ children }) => (
  <>
    {isProduction ? <Analytics /> : null}
    {isProduction ? <SpeedInsights /> : null}

    <ErrorBoundary>
      <ThemeProvider>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </ThemeProvider>
    </ErrorBoundary>
  </>
);

export default AppProviders;
