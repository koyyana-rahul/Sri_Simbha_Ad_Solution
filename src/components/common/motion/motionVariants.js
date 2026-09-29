/**
 * Shared framer-motion variants (the app's motion design tokens).
 *
 * These were previously copy-pasted into five components with subtly different
 * timings; keeping one canonical set makes the site's motion feel consistent
 * and gives a single place to tune it.
 *
 * TIMING IS A PERFORMANCE DECISION, NOT A TASTE DECISION.
 *
 * These variants stagger by index, so the total time before the *last* item in
 * a list is visible is `stagger * count + duration`. The previous values were
 * 0.2–0.3s per item with 0.6–0.9s durations, which meant the sixth service
 * card waited roughly 1.9 seconds and the twelfth gallery image nearly 2.3
 * seconds after it scrolled into view. Content the visitor has already
 * scrolled to was being deliberately withheld from them.
 *
 * The values below keep the staggered feel but cap the worst case at roughly
 * half a second. Anything genuinely above the fold is not animated at all.
 */

/** One index step. Small enough that a 12-item grid never feels withheld. */
const STEP = 0.06;

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: Math.min(i, 6) * STEP,
      duration: 0.45,
      ease: "easeOut",
    },
  }),
};

export const fadeUpLarge = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: Math.min(i, 6) * STEP,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

export const flipCard = {
  hidden: { rotateY: -60, opacity: 0 },
  visible: (i = 0) => ({
    rotateY: 0,
    opacity: 1,
    transition: {
      delay: Math.min(i, 6) * STEP,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

export const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STEP, delayChildren: 0 },
  },
};

export const staggerFast = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

/** Gallery tiles: gentle scale-in, staggered by the parent grid. */
export const cardVariant = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

/**
 * Service grid tiles: rotate in on the Y axis, staggered by index.
 *
 * The rotation is kept because it is the one motion in the app that carries
 * meaning (cards turning to face you), but the entry scale went from 0.8 to
 * 0.92 and the duration from 0.9s to 0.45s so the row does not visibly crawl.
 */
export const cardVariants = {
  hidden: { opacity: 0, scale: 0.92, rotateY: 60 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      delay: Math.min(i, 6) * STEP,
      duration: 0.45,
      ease: [0.2, 0.8, 0.2, 1],
    },
  }),
};

/**
 * Viewport trigger reused by every scroll-revealed section.
 *
 * `amount: 0.2` means an element only animates once a fifth of it is visible.
 * For a section taller than the viewport that is impossible, so tall sections
 * never animated at all; `amount: 0` plus `margin` fires as soon as any part
 * enters, which is what a reveal is supposed to mean.
 *
 * `once: true` is deliberate, and the reveal depends on it: without it the
 * `hidden` variant would be restored the moment a tall section scrolled past,
 * so a section taller than the viewport would blank out again and stay blank.
 *
 * The same latch is why a page that is reused across a param change must be
 * remounted, otherwise the observer is never re-evaluated against the new
 * layout. `ServiceDetailPage` keys its content by service id for exactly that
 * reason.
 */
export const inViewOnce = { once: true, amount: 0, margin: "0px 0px -10% 0px" };
