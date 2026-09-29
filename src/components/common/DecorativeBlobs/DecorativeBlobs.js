/**
 * The blurred yellow/purple gradient blobs that appear behind most sections.
 *
 * They were copy-pasted into five components; this component is decorative
 * only, so it is hidden from assistive technology and marked `aria-hidden`.
 *
 * The drift runs on a CSS `transform` animation (`animate-blob-a` / `-b` in
 * `styles/motion.css`) rather than a framer-motion `repeat: Infinity` loop.
 * Both of these blobs are mounted on the services, about, contact and service
 * detail pages, so the JS version meant a style write per blob per frame for an
 * effect the compositor can run without JavaScript. Reduced motion is handled
 * by the same media query that disables the other decorative loops.
 */
const DecorativeBlobs = () => (
  <>
    <div
      aria-hidden="true"
      className="bg-blob animate-blob-a h-72 w-72 bg-yellow-300 opacity-20 -left-28 top-10"
    />
    <div
      aria-hidden="true"
      className="bg-blob animate-blob-b h-80 w-80 bg-purple-400 opacity-10 -right-28 bottom-10"
    />
  </>
);

export default DecorativeBlobs;
