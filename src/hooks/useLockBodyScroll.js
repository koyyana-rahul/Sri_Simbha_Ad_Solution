import { useEffect, useRef } from "react";

/**
 * Prevents background scrolling while `locked` is true, compensating for the
 * scrollbar width so the layout does not jump. Always restores the previous
 * body styles on unmount.
 */
const useLockBodyScroll = (locked) => {
  const previousOverflow = useRef("");
  const previousPaddingRight = useRef("");

  useEffect(() => {
    if (!locked || typeof document === "undefined") return undefined;

    const { body } = document;
    previousOverflow.current = body.style.overflow;
    previousPaddingRight.current = body.style.paddingRight;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = previousOverflow.current;
      body.style.paddingRight = previousPaddingRight.current;
    };
  }, [locked]);
};

export default useLockBodyScroll;
