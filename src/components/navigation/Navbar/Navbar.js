import { navigationItems } from "../../../config/navigation.config";
import NavItem from "../NavItem/NavItem";

/**
 * Primary (desktop) navigation.
 *
 * Rendered as a semantic `<nav>` + `<ul>` so assistive technology can jump
 * straight to it, and driven entirely by `navigation.config.js` — adding a
 * page never requires touching this component.
 */
const Navbar = ({ onNavigate, className = "" }) => (
  <nav aria-label="Primary" className={className}>
    <ul className="flex space-x-6 font-medium text-base">
      {navigationItems.map((item) => (
        <li key={item.id}>
          <NavItem to={item.path} label={item.label} onClick={onNavigate} />
        </li>
      ))}
    </ul>
  </nav>
);

export default Navbar;
