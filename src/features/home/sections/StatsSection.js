import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import {
  fadeUp,
  inViewOnce,
  stagger,
} from "../../../components/common/motion/motionVariants";
import { usePrefersReducedMotion } from "../../../hooks";
import { companyStats } from "../../../data/company.data";

/**
 * Animated statistics band.
 *
 * Counts up once, when the band first scrolls into view, and then stops — a
 * number that never stops changing is unreadable and looks like a bug.
 *
 * The animation is driven by `requestAnimationFrame` rather than a library, and
 * it is skipped entirely for visitors who prefer reduced motion, who get the
 * final value immediately. The `<span>` holding the number carries the real
 * value as its text content, so the figure is correct in the accessibility tree
 * and in the DOM even while the counter is still running.
 */
const StatsSection = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const [values, setValues] = useState(() =>
    companyStats.map((stat) => (prefersReducedMotion ? stat.value : 0))
  );

  const sectionRef = useRef(null);
  const hasRun = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setValues(companyStats.map((stat) => stat.value));
      return undefined;
    }

    const node = sectionRef.current;
    if (!node || hasRun.current) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;

        hasRun.current = true;
        observer.disconnect();

        const duration = 1400;
        const start = performance.now();

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          // easeOutCubic, so the number decelerates instead of stopping dead.
          const eased = 1 - (1 - progress) ** 3;

          setValues(companyStats.map((stat) => Math.round(stat.value * eased)));

          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  return (
    <section
      ref={sectionRef}
      aria-label="Company statistics"
      className="bg-gradient-to-r from-brand-500 to-orange-500 px-6 section-y-sm text-white sm:px-10"
    >
      <motion.dl
        className="mx-auto grid max-w-container grid-cols-2 gap-8 text-center lg:grid-cols-4"
        initial="hidden"
        whileInView="visible"
        viewport={inViewOnce}
        variants={stagger}
      >
        {companyStats.map((stat, index) => (
          <motion.div
            key={stat.id}
            variants={fadeUp}
            custom={index}
            // dt stays first in the DOM (correct for assistive tech) but the
            // reversed column puts the number above its label visually.
            className="flex flex-col-reverse"
          >
            <dt className="text-sm font-medium text-white/90 sm:text-base">
              {stat.label}
            </dt>
            <dd className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              {values[index]}
              {stat.suffix}
            </dd>
          </motion.div>
        ))}
      </motion.dl>
    </section>
  );
};

export default StatsSection;
