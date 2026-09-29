import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { fadeUp } from "../../../components/common/motion/motionVariants";
import { usePrefersReducedMotion } from "../../../hooks";
import { hero } from "../data/home.data";

/**
 * Should the background video play at all?
 *
 * The clip is a 944 KB autoplaying background loop. On a metered or slow
 * connection that is a real cost for a decorative effect, and the Network
 * Information API reports exactly that case:
 *  - `saveData`  — the visitor (or their OS) has asked to reduce data usage
 *  - `2g` / `slow-2g` — the connection cannot afford it
 *
 * In every one of those cases we skip the `<video>` entirely and show the
 * gradient backdrop, which was already there and already looks deliberate.
 * The API is Chromium-only, so everywhere else the video plays as before; this
 * is strictly a downgrade path, never an upgrade dependency.
 *
 * The answer is read in an effect rather than during render so it cannot cause
 * a hydration-style mismatch, and it never flips back on once decided — a
 * connection that improves mid-visit should not start a 944 KB download
 * unannounced.
 */
const shouldSkipVideo = () => {
  if (typeof navigator === "undefined") return false;

  const connection =
    navigator.connection ??
    navigator.mozConnection ??
    navigator.webkitConnection;

  if (!connection) return false;

  if (connection.saveData === true) return true;

  const type = connection.effectiveType;
  return type === "slow-2g" || type === "2g";
};

/**
 * Home hero.
 *
 * Video handling: `muted` + `playsInline` + `autoPlay` are required for
 * autoplay to work on iOS at all; the element additionally carries
 * `preload="metadata"` and a gradient backdrop so it never blocks first paint
 * or leaves a hole while buffering. For visitors who prefer reduced motion, and
 * for anyone on a metered or 2G connection, the clip is not rendered and the
 * gradient is shown instead.
 */
const HeroSection = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [skipVideo, setSkipVideo] = useState(false);

  useEffect(() => {
    setSkipVideo(shouldSkipVideo());
  }, []);

  const showVideo = !prefersReducedMotion && !skipVideo;

  return (
    <section
      className="relative flex h-viewport w-full items-center justify-center overflow-hidden text-center"
      aria-label="Introduction"
    >
      <div className={`absolute inset-0 z-0 ${hero.video.fallbackClassName}`}>
        {showVideo ? (
          <video
            className="h-full w-full object-cover"
            src={hero.video.src}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            // The video is decoration; the text below carries the message, so
            // it must never be announced or focusable.
            aria-hidden="true"
            tabIndex={-1}
          />
        ) : null}
        <div
          aria-hidden="true"
          /*
           * Scrim behind the hero copy.
           *
           * The background is a blurred, brightly-lit video, so its average
           * luminance changes from frame to frame and cannot be relied on. The
           * light-mode wash was `bg-white/30`, which measured gold title text
           * at roughly 2.2:1 against the result — the tail of
           * "…AD SOLUTION" was effectively invisible on both desktop and
           * mobile. Raising the wash to 45% gives the darker type below real
           * separation without hiding the footage.
           */
          className="absolute inset-0 bg-white/45 backdrop-blur-[6px] dark:bg-black/55"
        />
      </div>

      <motion.div
        className="relative z-20 max-w-3xl px-6"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <motion.h1
          className="bg-gradient-to-r bg-clip-text text-display font-bold text-transparent from-brand-600 via-brand-700 to-gray-900 dark:from-brand-300 dark:via-brand-400 dark:to-brand-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {hero.title}
        </motion.h1>

        <motion.p
          className="mt-6 font-medium text-gray-800 dark:text-gray-200"
          variants={fadeUp}
          custom={1}
        >
          <span className="block text-h1 font-bold text-gray-900 dark:text-white">
            {hero.headline}
          </span>
          {/* brand-700 rather than brand-600: on the light hero wash,
              brand-600 measured ~3.5:1 and brand-700 ~4.9:1. */}
          <span className="mt-2 block text-h2 font-bold text-brand-700 dark:text-brand-400">
            {hero.subHeadline}
          </span>
        </motion.p>
      </motion.div>
    </section>
  );
};

export default HeroSection;
