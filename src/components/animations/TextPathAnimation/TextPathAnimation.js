/**
 * Infinite scrolling service marquee.
 *
 * Purely decorative: the same service names are already available as real
 * links on the Services page, so this is hidden from assistive technology to
 * avoid announcing the same text twice. The keyframes moved out of the inline
 * `<style>` block into `styles/animations.css`, where they are also disabled
 * for visitors who prefer reduced motion.
 */
const TextPathAnimation = ({ items, secondaryItems = [] }) => {
  if (!items?.length) return null;

  return (
    <div
      aria-hidden="true"
      className="relative w-full overflow-hidden bg-neutral-100 py-10 dark:bg-surface-dark sm:py-16"
    >
      <div className="flex flex-col items-center justify-center gap-10 sm:gap-16">
        <div className="relative w-full overflow-hidden">
          <div className="marquee-wrapper font-semibold tracking-wide">
            <div className="marquee-track gap-10 text-[10vw] text-transparent sm:text-[7vw] md:text-[5vw] lg:text-[4vw]">
              {[0, 1].map((copy) => (
                <div className="flex gap-10" key={copy}>
                  {items.map((item) => (
                    <span
                      className="flex items-center gap-3 whitespace-nowrap"
                      key={`${copy}-${item}`}
                    >
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 dark:from-brand-400 dark:to-red-500" />
                      <span className="bg-gradient-to-r bg-clip-text from-sky-500 via-indigo-500 to-purple-700 dark:from-brand-400 dark:via-pink-500 dark:to-red-500">
                        {item}
                      </span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {secondaryItems.length > 0 && (
          <div className="relative w-full overflow-hidden">
            <div className="marquee-wrapper font-extrabold tracking-tight outlined-text">
              <div className="marquee-track marquee-track--secondary text-[10vw] text-transparent sm:text-[7vw] md:text-[5vw] lg:text-[4vw]">
                {Array.from({ length: 6 }, (_, index) => (
                  <span
                    key={index}
                    className="mx-6 inline-block whitespace-nowrap sm:mx-12"
                  >
                    • {secondaryItems.join(" • ")}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextPathAnimation;
