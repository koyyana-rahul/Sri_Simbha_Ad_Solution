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

    <main id="main-content" className="flex-1" tabIndex={-1}>
      <Suspense fallback={<Loader className="min-h-[60vh]" />}>
        <Outlet />
      </Suspense>
    </main>

    <Footer />
    <WhatsAppButton />

    <ScrollToTop />
  </div>
);

export default App;
