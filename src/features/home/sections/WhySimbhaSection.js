import { motion } from "framer-motion";

import {
  fadeUp,
  flipCard,
  inViewOnce,
  stagger,
} from "../../../components/common/motion/motionVariants";
import { whySimbha } from "../data/home.data";

/** "Why Sri Simbha?" — three differentiators rendered from `whySimbha`. */
const WhySimbhaSection = () => (
  <section className="bg-gradient-to-br from-brand-50 via-brand-100 to-brand-200 px-6 section-y text-center dark:from-gray-900 dark:via-black dark:to-gray-900">
    <motion.h2
      className="mb-12 text-h2 font-bold"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={inViewOnce}
    >
      Why Sri Simbha?
    </motion.h2>

    <motion.ul
      className="mx-auto grid max-w-container gap-10 sm:grid-cols-2 md:grid-cols-3"
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={inViewOnce}
    >
      {whySimbha.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.li
            key={item.id}
            className="rounded-2xl border border-gray-200 bg-white p-8 text-left backdrop-blur-lg transition-all hover:shadow-yellow-300 dark:border-white/10 dark:bg-white/10"
            variants={flipCard}
            custom={index}
            whileHover={{ scale: 1.08 }}
          >
            <motion.div
              className="mb-4 text-h2 text-brand-600 dark:text-brand-400"
              whileHover={{ scale: 1.2, rotate: [0, 10, -10, 0] }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              <Icon aria-hidden="true" />
            </motion.div>
            <h3 className="text-lg font-semibold tracking-wide sm:text-xl">
              {item.title}
            </h3>
            <p className="mt-2 text-base leading-relaxed text-gray-600 dark:text-gray-300">
              {item.description}
            </p>
          </motion.li>
        );
      })}
    </motion.ul>
  </section>
);

export default WhySimbhaSection;
