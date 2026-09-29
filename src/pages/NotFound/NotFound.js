import { Link } from "react-router-dom";

import Button from "../../components/common/Button/Button";
import Seo from "../../components/common/Seo/Seo";
import siteConfig from "../../config/site.config";
import { navigationItems } from "../../config/navigation.config";

/**
 * 404 screen.
 *
 * A genuine catch-all route: unknown URLs used to render an empty outlet with
 * no explanation. Uses a real `h1`, a `role="status"` announcement and offers
 * both a link home and the primary navigation.
 */
const NotFound = () => (
  <section className="flex min-h-viewport flex-col items-center justify-center gap-6 bg-white px-4 py-20 text-center text-gray-900 dark:bg-surface-dark dark:text-gray-100">
    <Seo
      title="Page not found"
      description="The page you are looking for could not be found."
      path="/404"
      noIndex
    />

    <p className="text-eyebrow text-brand-600 dark:text-brand-400">Error 404</p>
    <h1 className="text-h1 font-extrabold">Page not found</h1>
    <p role="status" className="max-w-md text-gray-700 dark:text-gray-300">
      We couldn’t find the page you were looking for. It may have been moved or
      the address may contain a typo.
    </p>

    <div className="flex flex-wrap items-center justify-center gap-4">
      <Button as={Link} to="/" variant="gradient" size="md">
        Back to home
      </Button>
      <Button as={Link} to="/services" variant="outline" size="md">
        Browse services
      </Button>
    </div>

    <nav aria-label="Suggested pages" className="mt-4">
      <ul className="flex flex-wrap items-center justify-center gap-4 text-sm">
        {navigationItems.map((item) => (
          <li key={item.id}>
            <Link className="nav-link" to={item.path}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>

    <p className="text-body text-gray-500 dark:text-gray-400">
      Need help? Email{" "}
      <a
        className="tap-expand underline hover:text-brand-500"
        href={`mailto:${siteConfig.contact.email}`}
      >
        {siteConfig.contact.email}
      </a>
    </p>
  </section>
);

export default NotFound;
