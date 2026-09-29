import { useEffect, useRef } from "react";

import { useEscapeKey } from "../../../hooks";
import { navigationItems } from "../../../config/navigation.config";
import siteConfig from "../../../config/site.config";
import { cx } from "../../../utils/helpers";
import ThemeToggle from "../../common/ThemeToggle/ThemeToggle";
import NavItem from "../NavItem/NavItem";

/**
 * Slide-in navigation panel for small screens.
 *
 * Accessibility work over the original implementation:
 *  - the panel is a labelled `<nav>` referenced by `aria-controls`
 *  - `aria-expanded` on the trigger reflects the real state
 *  - Escape closes it, and clicking outside closes it
 *  - links are real anchors in a `<ul>`, and the menu closes on navigation
 *  - it is hidden from the accessibility tree *and* from tab order when closed
 *
 * `toggleRef` is the trigger button. It is excluded from the outside-click test
 * on purpose: a press on the trigger produces `pointerdown` (which the
 * outside-click handler sees as "outside the panel", so it closes) followed by
 * `click` (which the trigger's own handler sees as "toggle", so it re-opens).
 * The two handlers cancelled out and a second press on the hamburger left the
 * menu open. Treating the trigger as part of the panel leaves exactly one
 * handler responsible for it.
 */
const MobileMenu = ({
  isOpen,
  onClose,
  id = "mobile-navigation",
  toggleRef,
}) => {
  const panelRef = useRef(null);

  useEscapeKey(onClose, isOpen);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      const target = event.target;
      if (panelRef.current?.contains(target)) return;
      if (toggleRef?.current?.contains(target)) return;
      onClose();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen, onClose, toggleRef]);

  return (
    <div
      ref={panelRef}
      id={id}
      className={cx(
        "mobile-menu lg:hidden",
        isOpen ? "mobile-menu--open" : "mobile-menu--closed"
      )}
    >
      <nav aria-label="Mobile" className="menu-list font-medium text-base">
        <ul className="flex w-full flex-col items-center gap-3">
          {navigationItems.map((item) => (
            <li key={item.id}>
              <NavItem to={item.path} label={item.label} onClick={onClose} />
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-col items-center gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
          <a
            href={`tel:+${siteConfig.contact.phoneDigits}`}
            className="py-2 text-sm font-semibold text-brand-600 dark:text-brand-400"
          >
            {siteConfig.contact.phone}
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
};

export default MobileMenu;
