import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import Loader from "../components/common/Loader/Loader";
import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";
import ScrollToTop from "../components/layout/ScrollToTop/ScrollToTop";
import WhatsAppButton from "../components/floating/WhatsAppButton/WhatsAppButton";

/**
 * Root layout shared by every route.
 *
 * Responsibilities kept here (and nowhere else):
 *  - skip link + landmark structure
 *  - header / outlet / footer / floating CTA
 *  - a top-level `Suspense` boundary so lazily-loaded route chunks have a
 *    fallback instead of a blank screen
 */
const App = () => (
  <div className="flex min-h-viewport flex-col font-inter">
    <a className="skip-link" href="#main-content">
      Skip to main content
    </a>

    <Header />

    {/*
      The `<main>`, the footer and the outlet all share one Suspense boundary,
      and the footer is deliberately inside it.

      The footer used to sit outside, so it painted immediately beside the
      loading fallback — measured at document height 720px with the footer at
      y=604 — and was then pushed down to y=4098/6188 the moment the lazy route
      chunk resolved. That single move was 0.161 of the 0.1618 total CLS, on
      every route (fonts were ruled out: `document.fonts.ready` resolved at
      4.2s, long after the shift at 1.1s).

      Inside the boundary the footer simply does not exist while the page is
      loading, so nothing can shift. The visitor sees the header and a
      full-height loader, then the page and its footer arrive together.

      `<WhatsAppButton />` stays outside: it is `position: fixed`, so it never
      moves and contributes nothing to CLS, and it should stay available while
      the page loads.
    */}
    <Suspense fallback={<Loader className="min-h-viewport" />}>
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>

      <Footer />
    </Suspense>

    <WhatsAppButton />

    <ScrollToTop />
  </div>
);

export default App;
