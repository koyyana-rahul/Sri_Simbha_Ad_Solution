// jest-dom adds custom jest matchers for asserting on DOM nodes.
// For example: expect(element).toHaveTextContent(/react/i)
// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

/**
 * jsdom does not expose the WHATWG Encoding API, which react-router v7 relies
 * on internally. Node's implementation is API-compatible for our purposes.
 */
if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder;
}

/**
 * jsdom implements neither observer API. Framer Motion's `whileInView` needs
 * IntersectionObserver, so provide inert stubs that report "nothing visible"
 * (content stays in its `hidden` variant, which is fine for assertions that
 * look at structure rather than animation end-state).
 */
class MockObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe() {}

  unobserve() {}

  disconnect() {}

  takeRecords() {
    return [];
  }
}

if (typeof global.IntersectionObserver === "undefined") {
  global.IntersectionObserver = MockObserver;
}
if (typeof global.ResizeObserver === "undefined") {
  global.ResizeObserver = MockObserver;
}
if (typeof window !== "undefined") {
  window.IntersectionObserver = global.IntersectionObserver;
  window.ResizeObserver = global.ResizeObserver;
}

/**
 * jsdom does not implement `window.matchMedia`, which the layout hooks rely on
 * for responsive behaviour. This stub returns `matches: false` by default and
 * allows individual tests to override the answer per query.
 */
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
