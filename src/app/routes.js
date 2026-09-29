import { lazy } from "react";
import {
  createBrowserRouter,
  isRouteErrorResponse,
  redirect,
  useRouteError,
} from "react-router-dom";

import App from "./App";
import AppProviders from "./providers";
import RouteError from "../pages/Error/RouteError";
import NotFoundPage from "../pages/NotFound/NotFound";
import { getServiceByPath } from "../config/services.config";
import {
  loadHome,
  loadServices,
  loadServiceDetail,
  loadAbout,
  loadContact,
  loadNotFound,
} from "./routeLoaders";

/*
 * Route-level code splitting.
 *
 * Every page is a separate chunk, so the initial download only contains the
 * shell (header, footer, floating CTA) plus the requested page. Previously all
 * eleven screens shipped in one bundle.
 *
 * The loader functions themselves live in `routeLoaders.js` so that navigation
 * components can prefetch a chunk without importing this module — see the note
 * in that file.
 */
const Home = lazy(loadHome);
const Services = lazy(loadServices);
const ServiceDetail = lazy(loadServiceDetail);
const About = lazy(loadAbout);
const Contact = lazy(loadContact);
const NotFound = lazy(loadNotFound);

/**
 * The service detail screen is a single dynamic route.
 *
 * `pathToRegexp` wildcards let the original, already-indexed underscore URLs
 * keep working (`/services/ad_films`) while the kebab-case spelling
 * (`/services/ad-films`) resolves to the exact same screen. A loader rejects
 * unknown slugs before the page renders, so a mistyped URL can never produce
 * an empty page.
 */
const serviceLoader = ({ params }) => {
  if (!getServiceByPath(`/services/${params.slug}`)) {
    throw new Response("Service not found", { status: 404 });
  }
  return null;
};

/**
 * Error element for the service-detail route only.
 *
 * `errorElement` on a route replaces that route's *entire* element. The
 * catch-all `errorElement` below sits on the parent route, which renders the
 * app shell, so a loader throwing for an unknown service slug replaced the
 * whole shell: measured on the built site, `/services/does-not-exist` rendered
 * a bare "Oops!" with no header, no `<main>`, no footer, no navigation, no skip
 * link and no contact CTA — while an unknown *top-level* route kept all of it.
 * A mistyped or expired service URL stranded the visitor.
 *
 * Declaring the boundary on this child instead means the error renders where
 * the service page would have been, inside the shell.
 *
 * A 404 gets the full `NotFound` screen, which already offers a breadcrumb-free
 * explanation, a link home and the primary navigation; anything else falls
 * through to the generic `RouteError`.
 */
const ServiceErrorElement = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />;
  }

  return <RouteError />;
};

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppProviders>
        <App />
      </AppProviders>
    ),
    // Last-resort boundary. Anything without a nearer one lands here and, as
    // before, loses the shell — that is the correct trade for a genuine
    // app-level crash, where the shell may be what failed.
    errorElement: <RouteError />,
    children: [
      { index: true, element: <Home /> },
      { path: "services", element: <Services /> },
      {
        path: "services/:slug",
        element: <ServiceDetail />,
        loader: serviceLoader,
        errorElement: <ServiceErrorElement />,
      },
      /**
       * Historic alias.
       *
       * This used to *render* the contact page at `/services/contact`, which
       * gave the same content two indexable URLs with no canonical pointing
       * either way — the classic duplicate-content setup. It is now a redirect
       * to the canonical `/contact`, so the old link keeps working and search
       * engines consolidate on a single address.
       */
      { path: "services/contact", loader: () => redirect("/contact") },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default appRouter;
