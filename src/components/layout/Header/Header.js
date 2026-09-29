import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

import logo from "../../../assets/images/branding/simba-logo.jpg";
import siteConfig from "../../../config/site.config";
import useMediaQuery from "../../../hooks/useMediaQuery";
import { MOBILE_NAV_BREAKPOINT } from "../../../utils/constants";
import ThemeToggle from "../../common/ThemeToggle/ThemeToggle";
import Navbar from "../../navigation/Navbar/Navbar";
import MobileMenu from "../../navigation/MobileMenu/MobileMenu";

const MOBILE_MENU_ID = "mobile-navigation";

/**
 * Site header: brand, primary navigation and the small-screen menu trigger.
 *
 * All of the CSS that used to be generated at runtime from the theme string
 * (a ~90-line template literal) now lives in `styles/globals.css` and is
 * switched with the `dark` class, so re-renders on theme change no longer
 * re-serialise a <style> tag.
 */
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isDesktop = useMediaQuery(`(min-width: ${MOBILE_NAV_BREAKPOINT}px)`);

  // Shared with the mobile panel so its outside-click test ignores presses on
  // the trigger. Without this the two handlers fight and the menu cannot be
  // closed by pressing the hamburger again.
  const toggleRef = useRef(null);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  const toggleMenu = () => setIsMenuOpen((open) => !open);

  // The panel is unmounted on desktop, so make sure a stale "open" state can
  // never be revealed again if the viewport shrinks back to mobile.
  useEffect(() => {
    if (isDesktop) closeMenu();
  }, [isDesktop, closeMenu]);

  return (
    <header className="site-header">
      <div className="mx-auto flex w-full max-w-container items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-3 rounded-md"
          aria-label={`${siteConfig.name} — home`}
        >
          <span className="logo-container">
            <img
              className="logo-img"
              alt={siteConfig.logoAlt}
              src={logo}
              width={50}
              height={50}
            />
          </span>
          <span className="animated-brand">{siteConfig.shortName}</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Navbar onNavigate={closeMenu} className="hidden lg:block" />

          <ThemeToggle className="hidden lg:inline-flex" />

          <button
            ref={toggleRef}
            type="button"
            onClick={toggleMenu}
            className="-mr-2 rounded-md p-2 text-gray-900 transition hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 lg:hidden"
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
            aria-controls={MOBILE_MENU_ID}
          >
            {isMenuOpen ? (
              <X size={28} aria-hidden="true" />
            ) : (
              <Menu size={28} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {isDesktop ? null : (
        <MobileMenu
          id={MOBILE_MENU_ID}
          isOpen={isMenuOpen}
          onClose={closeMenu}
          toggleRef={toggleRef}
        />
      )}
    </header>
  );
};

export default Header;
