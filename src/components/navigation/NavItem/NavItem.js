import { NavLink } from "react-router-dom";

import { preloadRouteFor } from "../../../app/routeLoaders";

/**
 * A single navigation link.
 *
 * Uses react-router's `NavLink`, which sets `aria-current="page"` on the
 * active route. The corresponding visual state is handled by the global
 * `.nav-link[aria-current="page"]` rule, so no per-item `isActive` styling is
 * duplicated here.
 *
 * `onPointerEnter` / `onFocus` kick off the route prefetch. Deliberately *not*
 * `onMouseEnter`: a pointer that is already down over the link never fires
 * `mouseenter`, so a tap on a touch device would get no prefetch at all.
 */
const NavItem = ({ to, label, className = "", onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    onPointerEnter={() => preloadRouteFor(to)}
    onFocus={() => preloadRouteFor(to)}
    className={`nav-link text-sm font-medium sm:text-base md:text-lg ${className}`.trim()}
  >
    {label}
  </NavLink>
);

export default NavItem;
