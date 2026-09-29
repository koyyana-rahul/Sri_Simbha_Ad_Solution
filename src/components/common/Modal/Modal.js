import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { useEscapeKey, useLockBodyScroll } from "../../../hooks";
import { cx } from "../../../utils/helpers";

/**
 * Selector for everything that can receive focus inside the dialog.
 *
 * `[tabindex]:not([tabindex="-1"])` keeps our own `-1` sentinels out of the
 * cycle while still allowing a programmatically focusable element in.
 */
const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

/**
 * Accessible dialog / image lightbox.
 *
 * The `aria-modal="true"` this component has always declared is a *promise* to
 * assistive technology: the content outside is inert and Tab will not leave.
 * Nothing enforced that promise — Tab walked straight out of the lightbox into
 * the page behind it, so a keyboard user could end up "inside" a dialog that
 * was visually covering the page, interacting with invisible controls. The trap
 * below makes the markup honest.
 *
 * Also handled here:
 *  - Escape, backdrop click and the close button all dismiss
 *  - focus moves to the close button on open and returns to the element that
 *    opened the dialog on close
 *  - background scrolling is locked, with scrollbar-width compensation so the
 *    page does not shift sideways as the bar disappears
 *  - it renders through a portal on `document.body`, so it is never clipped by
 *    an ancestor with `overflow: hidden` or trapped inside a transformed
 *    stacking context, and so the focus trap below genuinely contains it
 */
const Modal = ({ isOpen, onClose, title, children }) => {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEscapeKey(onClose, isOpen);
  useLockBodyScroll(isOpen);

  // Remember the trigger, move focus in, and put it back on close.
  useEffect(() => {
    if (isOpen) {
      previouslyFocused.current = document.activeElement;
      closeButtonRef.current?.focus();
    } else {
      previouslyFocused.current?.focus?.();
    }
  }, [isOpen]);

  // Keep Tab inside the dialog.
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = Array.from(dialog.querySelectorAll(FOCUSABLE)).filter(
        (element) => element.offsetParent !== null
      );

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-start justify-center overflow-auto bg-black/60 px-4 pt-24 sm:px-6 sm:pt-28"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            className="relative max-w-full"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="absolute -top-11 right-0 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
            >
              <X size={22} aria-hidden="true" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

/**
 * Lightbox shell styled for image previews.
 *
 * The image is marked `priority` (eager, high fetch priority) because by the
 * time the dialog exists the visitor has explicitly asked for this specific
 * file — lazy-loading it would just add a spinner.
 */
export const ImageModal = ({ isOpen, onClose, src, alt, title }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title || alt}>
    <img
      src={src}
      alt={alt}
      loading="eager"
      decoding="async"
      className={cx(
        "max-h-[80vh] max-w-full rounded-xl border-4 shadow-2xl",
        "border-white dark:border-brand-400"
      )}
    />
  </Modal>
);

export default Modal;
