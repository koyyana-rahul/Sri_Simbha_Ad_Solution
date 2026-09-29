/**
 * Web Vitals reporting.
 *
 * The `web-vitals` chunk is only fetched when a reporter is supplied, so the
 * production bundle never downloads it. In development the metrics are printed
 * to the console; in production this is a no-op (Vercel Speed Insights already
 * collects the same metrics in production).
 */
const reportWebVitals = (onPerfEntry) => {
  if (typeof onPerfEntry !== "function") return;

  import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
  });
};

export const initWebVitals = () => {
  if (process.env.NODE_ENV !== "development") return;
  reportWebVitals((metric) => {
    // eslint-disable-next-line no-console
    console.log(`[web-vitals] ${metric.name}: ${Math.round(metric.value)}`);
  });
};

export default reportWebVitals;
