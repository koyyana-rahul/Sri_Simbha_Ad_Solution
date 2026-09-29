import { Fragment } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import StructuredData from "../StructuredData/StructuredData";
import { cx } from "../../../utils/helpers";
import { buildBreadcrumbSchema } from "../../../utils/structuredData";

/**
 * Accessible breadcrumb trail.
 *
 * A real `<nav aria-label="Breadcrumb">` wrapping an ordered list, which is the
 * only structure screen readers reliably announce as a trail. The final crumb
 * is the current page: it is a `<span aria-current="page">` rather than a link,
 * so it is not focusable and cannot be activated to reload the page you are
 * already on.
 *
 * The same `items` array also produces the `BreadcrumbList` JSON-LD, so the
 * markup Google reads and the trail a person sees can never disagree — which is
 * what structured-data validators flag as a manual action.
 *
 * @param {{name: string, path: string, current?: boolean}[]} items
 *   Ordered from the root to the current page. The last entry is treated as
 *   current unless it says otherwise.
 */
const Breadcrumbs = ({ items = [], className, showSchema = true }) => {
  if (items.length === 0) return null;

  // Exactly one crumb is the current page. Normally that is the last one, but
  // an item may declare it explicitly — and when it does, that wins, so a
  // caller can render a trail for a page that is not the end of the chain
  // (a comparison view, say) without every crumb becoming "current".
  const explicitCurrent = items.findIndex((item) => item.current === true);
  const currentIndex =
    explicitCurrent === -1 ? items.length - 1 : explicitCurrent;

  return (
    <>
      {showSchema ? (
        <StructuredData data={buildBreadcrumbSchema(items)} />
      ) : null}

      <nav aria-label="Breadcrumb" className={cx("w-full", className)}>
        <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          {items.map((item, index) => {
            const isCurrent = index === currentIndex;

            return (
              <Fragment key={item.path}>
                <li className="flex items-center gap-1">
                  {isCurrent ? (
                    <span
                      aria-current="page"
                      className="font-medium text-brand-600 dark:text-brand-400"
                    >
                      {item.name}
                    </span>
                  ) : (
                    <Link
                      to={item.path}
                      // `inline-block` + `py-1` takes the crumb from 20px to
                      // 28px tall, clearing the WCAG 2.2 minimum target size
                      // without visibly changing the trail's spacing.
                      className="inline-block rounded py-1 transition-colors hover:text-brand-500"
                    >
                      {item.name}
                    </Link>
                  )}
                </li>

                {isCurrent ? null : (
                  <li aria-hidden="true" className="flex items-center">
                    <ChevronRight size={14} className="shrink-0 opacity-60" />
                  </li>
                )}
              </Fragment>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;
