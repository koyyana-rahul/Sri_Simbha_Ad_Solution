import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

import {
  cardVariants,
  inViewOnce,
} from "../../../components/common/motion/motionVariants";

/**
 * A single service tile on the Services grid.
 *
 * The whole tile is one link (rather than a `<Link>` wrapping a clickable
 * `<div>`), it exposes `aria-label` so the icon does not leak into the
 * accessible name, and it highlights on focus as well as hover.
 */
const ServiceCard = ({ service, index }) => {
  const Icon = service.icon;

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={inViewOnce}
      variants={cardVariants}
      whileHover={{ scale: 1.05, rotateZ: 1 }}
      className="h-full"
    >
      <Link
        to={service.path}
        aria-label={`${service.title} — learn more`}
        className="group relative block h-full overflow-hidden rounded-2xl border border-white/40 bg-white/30 p-6 text-center shadow-xl backdrop-blur-lg transition-all duration-300 hover:shadow-brand-300/30 focus-visible:shadow-brand-300/30 dark:border-white/10 dark:bg-gray-800 dark:hover:shadow-brand-500/40 sm:p-8"
      >
        <div className="mb-5 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-300 to-orange-400 shadow-md ring-4 ring-brand-100 transition-all duration-300 group-hover:scale-110 dark:from-brand-400 dark:to-orange-500 dark:ring-brand-900 sm:h-20 sm:w-20">
            {/* The bob is a CSS `transform` animation (`animate-icon-float`).
                As a framer-motion `repeat: Infinity` loop this ran one
                JavaScript style write per card per frame — six of them
                simultaneously on this page — to move a decorative icon. */}
            <span className="animate-icon-float flex">
              <Icon
                className="h-7 w-7 text-white sm:h-9 sm:w-9"
                aria-hidden="true"
              />
            </span>
          </div>
        </div>

        <h2 className="mb-2 flex items-center justify-center gap-2 text-h3 font-semibold text-brand-600 dark:text-brand-400">
          {service.title}
          <ExternalLink
            className="h-5 w-5 shrink-0 sm:h-6 sm:w-6"
            aria-hidden="true"
          />
        </h2>

        <p className="text-body text-gray-700 dark:text-gray-300">
          {service.description}
        </p>
      </Link>
    </motion.div>
  );
};

export default ServiceCard;
