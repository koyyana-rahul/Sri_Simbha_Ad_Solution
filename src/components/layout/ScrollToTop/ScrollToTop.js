import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { scrollToTop } from "../../../utils/helpers";

/**
 * Resets the scroll position whenever the route changes.
 *
 * Uses `useLocation().pathname` (not `location`) so a query-string change on
 * the same page does not yank the user back to the top.
 *
 * The jump is **instant**, deliberately. This used to be `scrollToTop("smooth")`,
 * which meant every navigation began by animating the viewport from wherever
 * the visitor happened to be — often the very bottom of a long services page —
 * to the top. On a long page that animation runs for the better part of a
 * second, during which the new page is already mounted but the visitor is still
 * watching the old one scroll away. It read as lag on the click.
 *
 * Smooth scrolling is still used for in-page anchor jumps (see the
 * `scroll-behavior: smooth` rule in `styles/globals.css`); it is only this
 * full-document reset that should be immediate.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollToTop("auto");
  }, [pathname]);

  return null;
};

export default ScrollToTop;
