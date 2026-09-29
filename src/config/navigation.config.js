/**
 * Central navigation definition.
 *
 * The header (desktop + mobile), the footer and the connect section all read
 * from this array, so adding a page only requires editing this file plus
 * `app/routes.js`.
 */

const navigationItems = [
  { id: "home", label: "Home", path: "/" },
  { id: "services", label: "Services", path: "/services" },
  { id: "about", label: "About Us", path: "/about" },
  { id: "contact", label: "Contact Us", path: "/contact" },
];

/** Footer company column — deliberately a subset of the primary navigation. */
const footerNavigation = navigationItems.filter((item) =>
  ["about", "services", "contact"].includes(item.id)
);

export { navigationItems, footerNavigation };
