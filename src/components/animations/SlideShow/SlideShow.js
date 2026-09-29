import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import useMediaQuery from "../../../hooks/useMediaQuery";
import usePrefersReducedMotion from "../../../hooks/usePrefersReducedMotion";
import {
  AUTOPLAY_INTERVAL_MS,
  SLIDESHOW_SINGLE_SLIDE_BREAKPOINT,
} from "../../../utils/constants";
import { getCircularWindow, wrapIndex } from "../../../utils/helpers";
import Image from "../../common/Image/Image";

/**
 * Service slideshow.
 *
 * Behaviour is identical to the original (one slide under 640px, two above,
 * 5s autoplay, directional slide transitions). Fixes:
 *  - slide count now comes from `matchMedia` instead of a `resize` listener
 *  - autoplay is suspended for visitors who prefer reduced motion, and while
 *    the carousel is hovered or focused, so nobody loses content mid-read
 *  - the track is a labelled `region` with previous/next buttons that carry
 *    accessible names, plus a live position announcement
 *  - the interval is always cleared on unmount
 */
const SlideShow = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const isCompact = useMediaQuery(
    `(max-width: ${SLIDESHOW_SINGLE_SLIDE_BREAKPOINT - 1}px)`
  );
  const prefersReducedMotion = usePrefersReducedMotion();

  const slidesToShow = isCompact ? 1 : 2;
  const total = slides.length;

  const goTo = useCallback(
    (step) => {
      setDirection(step);
      setCurrentIndex((previous) =>
        wrapIndex(previous + step * slidesToShow, total)
      );
    },
    [slidesToShow, total]
  );

  const goToNext = useCallback(() => goTo(1), [goTo]);
  const goToPrevious = useCallback(() => goTo(-1), [goTo]);

  useEffect(() => {
    if (prefersReducedMotion || isPaused || total === 0) return undefined;

    const intervalId = window.setInterval(goToNext, AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [prefersReducedMotion, isPaused, goToNext, total]);

  if (total === 0) return null;

  const visibleSlides = getCircularWindow(slides, currentIndex, slidesToShow);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Our services"
      className="relative mx-auto w-full max-w-container overflow-hidden rounded-xl bg-gray-100 p-4 shadow-xl dark:bg-gray-900"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <button
        type="button"
        onClick={goToPrevious}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
      >
        <FaChevronLeft size={20} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={goToNext}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
      >
        <FaChevronRight size={20} aria-hidden="true" />
      </button>

      <p aria-live="polite" className="sr-only">
        Slide {currentIndex + 1} of {total}
      </p>

      <AnimatePresence custom={direction} mode="wait" initial={false}>
        <motion.div
          key={currentIndex}
          custom={direction}
          initial={{ x: direction > 0 ? 100 : -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction > 0 ? -100 : 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex items-center justify-center gap-4"
        >
          {visibleSlides.map((slide, offset) => (
            <figure
              key={`${slide.id}-${offset}`}
              className="relative aspect-video w-full overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-105 sm:w-1/2 dark:bg-gray-800"
            >
              <Image
                src={slide.src}
                alt={slide.caption}
                ratio="16 / 9"
                className="object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-center text-sm font-medium text-white sm:text-base">
                {slide.caption}
              </figcaption>
            </figure>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default SlideShow;
