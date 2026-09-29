import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import {
  fadeUp,
  inViewOnce,
  stagger,
} from "../../../components/common/motion/motionVariants";
import services from "../../../config/services.config";

/**
 * "Other services" strip shown at the bottom of a service page.
 *
 * A visitor who lands on `/services/led` from search has not finished — the
 * most common next step is either a second channel or the full list. Every
 * service is one click away, derived from the registry rather than a
 * hand-picked list, so nothing can rot.
 *
 * The current service is excluded from its own list.
 *
 * All of the others are shown, not a subset. This previously took
 * `.slice(0, 3)` of the remaining five, which meant the three shown were always
 * the first three in registry order rather than anything meaningful — and two
 * services were consequently unreachable from every detail page (from
 * `ad_films` you could only reach LED, Tea Cup and Digital Marketing; Ads on
 * Wheels and Website Building were never offered anywhere).
 */
const RelatedServices = ({ currentId, count }) => {
  const related = services.filter((service) => service.id !== currentId);

  if (related.length === 0) return null;

  return (
    <section
      aria-labelledby="related-services-heading"
      className="mx-auto w-full max-w-container px-2 pb-16 sm:px-4"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={inViewOnce}
        variants={stagger}
      >
        <motion.h2
          id="related-services-heading"
          variants={fadeUp}
          className="mb-2 text-center text-h2 font-semibold text-gray-900 dark:text-white"
        >
          Other services
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="measure-narrow mx-auto mb-8 text-center text-body text-gray-600 dark:text-gray-300"
        >
          Every channel we run, so you can compare before you commit to one.
        </motion.p>

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.li key={service.id} variants={fadeUp} custom={index}>
                <Link
                  to={service.path}
                  className="group flex h-full items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg focus-visible:border-brand-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-500"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-300 to-orange-400 text-white dark:from-brand-400 dark:to-orange-500"
                  >
                    <Icon size={22} />
                  </span>

                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 text-base font-semibold text-gray-900 dark:text-white">
                      {service.title}
                      <ArrowRight
                        size={16}
                        aria-hidden="true"
                        className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                      {service.description}
                    </span>
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </motion.div>
    </section>
  );
};

export default RelatedServices;
