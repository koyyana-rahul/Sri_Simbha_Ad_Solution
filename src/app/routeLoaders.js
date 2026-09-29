/**
 * Route chunk loaders and prefetching.
 *
 * These live apart from `app/routes.js` on purpose. `routes.js` imports the app
 * shell, which imports the Vercel analytics providers, so a leaf component such
 * as `NavItem` must never import from it — doing so would pull the entire
 * application graph (and the analytics SDKs) into anything that renders a nav
 * link, and would make `NavItem` untestable in isolation.
 *
 * Keeping the loader functions here means there is still exactly one definition
 * per route: `routes.js` wraps them in `lazy()`, and the nav wraps them in
 * `preloadRouteFor()`.
 */

const loadHome = () => import("../pages/Home/Home");
const loadServices = () => import("../pages/Services/Services");
const loadServiceDetail = () =>
  import("../pages/ServiceDetail/ServiceDetailPage");
const loadAbout = () => import("../pages/About/About");
const loadContact = () => import("../pages/Contact/Contact");
const loadNotFound = () => import("../pages/NotFound/NotFound");

/**
 * Maps a pathname onto the chunk that renders it.
 *
 * Kept deliberately small and explicit rather than derived from the route
 * table: a wrong entry costs one wasted prefetch, whereas an over-clever matcher
 * could prefetch the wrong chunk for every link. `/services/:slug` is covered
 * by the `loadServices` entry, because a service detail page and the services
 * index share the same lazy boundary in practice — the detail page imports its
 * own card and gallery components, so both are worth having early.
 */
const ROUTE_CHUNKS = [
  { match: (path) => path === "/", load: loadHome },
  {
    match: (path) => path === "/services" || path.startsWith("/services/"),
    load: loadServiceDetail,
  },
  { match: (path) => path === "/about", load: loadAbout },
  { match: (path) => path === "/contact", load: loadContact },
];

/**
 * Start downloading the chunk for a path the visitor is about to need.
 *
 * Called on `pointerenter` / `focus` of a navigation link, which is the earliest
 * moment there is any evidence of intent. React's `lazy()` dedupes concurrent
 * calls to the same importer, so hovering the same link repeatedly, or hovering
 * a link for a route that is already loaded, costs nothing.
 *
 * Prefetching is a pure optimisation: if it never fires, the `lazy()` import
 * still resolves normally on click. Nothing depends on it, and a failed
 * prefetch is swallowed here because the click-time import will surface the
 * real error with a proper boundary.
 */
export const preloadRouteFor = (path) => {
  if (typeof path !== "string") return;

  const entry = ROUTE_CHUNKS.find(({ match }) => match(path));
  if (!entry) return;

  entry.load().catch(() => {});
};

export {
  loadHome,
  loadServices,
  loadServiceDetail,
  loadAbout,
  loadContact,
  loadNotFound,
};
