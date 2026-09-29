import { useEffect } from "react";

/**
 * Calls `handler` when Escape is pressed. Used by the mobile menu and the
 * gallery lightbox so both are dismissible from the keyboard.
 */
const useEscapeKey = (handler, enabled = true) => {
  useEffect(() => {
    if (!enabled || typeof document === "undefined") return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") handler();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handler, enabled]);
};

export default useEscapeKey;
