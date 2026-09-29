import { motion } from "framer-motion";

import {
  cardVariant,
  staggerFast,
} from "../../../components/common/motion/motionVariants";
import Image from "../../../components/common/Image/Image";

/**
 * Grid of gallery images.
 *
 * Every tile is a real `<button>` (the original used `<div onClick>`, which
 * keyboard and screen-reader users could not open), it is focusable, has an
 * accessible name, and the images carry real alt text plus lazy loading.
 */
const ServiceGallery = ({ items, onSelect }) => (
  <motion.ul
    className="mx-auto mt-20 grid w-full max-w-container grid-cols-1 gap-6 px-2 sm:grid-cols-2 sm:gap-8 md:grid-cols-3 xl:grid-cols-4 sm:px-4"
    variants={staggerFast}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.1 }}
  >
    {items.map((item, index) => (
      <motion.li key={item.src} variants={cardVariant} className="h-full">
        <button
          type="button"
          onClick={() => onSelect(item)}
          className="group relative block h-full w-full overflow-hidden rounded-2xl bg-white shadow-md transition-shadow duration-300 hover:shadow-xl focus-visible:shadow-xl dark:bg-gray-800"
        >
          <Image
            src={item.src}
            alt={item.alt}
            ratio="1 / 1"
            className="transition-transform duration-500 group-hover:scale-110"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
          />
          {item.caption ? (
            <span className="absolute bottom-2 left-2 z-10 text-sm font-light text-white">
              {item.caption}
            </span>
          ) : null}
          <span className="sr-only">Open larger view of {item.alt}</span>
        </button>
      </motion.li>
    ))}
  </motion.ul>
);

export default ServiceGallery;
