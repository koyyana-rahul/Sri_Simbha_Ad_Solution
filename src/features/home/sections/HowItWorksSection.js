import { motion } from "framer-motion";

import {
  fadeUp,
  inViewOnce,
  stagger,
} from "../../../components/common/motion/motionVariants";
import { howItWorks } from "../data/home.data";

/** "How It Works" — the three-step onboarding flow. */
const HowItWorksSection = () => (
  <section className="bg-gradient-to-br from-yellow-100 via-white to-yellow-50 section-y dark:from-black dark:via-gray-900 dark:to-gray-800">
    <motion.h2
      className="mb-12 text-center text-h2 font-bold text-gray-900 dark:text-yellow-200 sm:text-4xl"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={inViewOnce}
    >
      How It Works
    </motion.h2>

    <motion.ol
      className="mx-auto grid max-w-7xl gap-12 px-6 sm:grid-cols-2 md:grid-cols-3"
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={inViewOnce}
    >
      {howItWorks.map((step, index) => {
        const Icon = step.icon;

        return (
          <motion.li
            key={step.id}
            className="rounded-xl border border-brand-400/20 bg-white/80 p-6 backdrop-blur-md transition-transform hover:scale-105 hover:shadow-2xl dark:bg-white/5"
            variants={fadeUp}
            custom={index}
          >
            <motion.div
              className="mb-4 text-h2 text-brand-600 dark:text-brand-400"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Icon aria-hidden="true" />
            </motion.div>
            <h3 className="mb-1 text-lg font-semibold tracking-wide sm:text-xl">
              {step.title}
            </h3>
            <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
              {step.description}
            </p>
          </motion.li>
        );
      })}
    </motion.ol>
  </section>
);

export default HowItWorksSection;
