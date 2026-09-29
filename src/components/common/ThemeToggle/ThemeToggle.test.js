import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ThemeToggle from "./ThemeToggle";
import ThemeProvider, { useTheme } from "../../../app/ThemeProvider";
import { THEME_STORAGE_KEY } from "../../../utils/constants";

/** Reports the current theme back out so it can be asserted on. */
const ThemeProbe = () => {
  const { theme } = useTheme();
  return <p data-testid="probe">{theme}</p>;
};

const renderToggle = () =>
  render(
    <ThemeProvider>
      <ThemeToggle />
      <ThemeProbe />
    </ThemeProvider>
  );

const probe = () => screen.getByTestId("probe").textContent;

/** The single toggle button, whichever direction it currently points. */
const toggle = () =>
  screen.getByRole("button", {
    name: /switch to (light|dark) mode/i,
  });

const beforeEachDom = () => {
  window.localStorage.clear();
  document.documentElement.classList.remove("dark");
  document.documentElement.removeAttribute("data-theme-transition");
  document.documentElement.style.colorScheme = "";
};

describe("ThemeToggle", () => {
  beforeEach(beforeEachDom);

  it("is a real button with an action-oriented accessible name", () => {
    renderToggle();

    const button = toggle();
    expect(button.tagName).toBe("BUTTON");
    expect(button).toHaveAccessibleName();
  });

  it("offers exactly two themes and no system/auto/monitor option", () => {
    renderToggle();

    // One control, not a group of choices. The site has two themes.
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(screen.queryByRole("radiogroup")).not.toBeInTheDocument();
    expect(screen.queryByRole("radio")).not.toBeInTheDocument();

    const names = screen.getByRole("button").getAttribute("aria-label");
    expect(names).not.toMatch(/system|auto|monitor|device/i);
  });

  it("switches directly between light and dark with no intermediate state", async () => {
    const user = userEvent.setup();
    renderToggle();

    // Default is dark, so the button must offer light.
    expect(probe()).toBe("dark");
    expect(toggle()).toHaveAccessibleName(/switch to light mode/i);

    await user.click(toggle());
    expect(probe()).toBe("light");
    expect(toggle()).toHaveAccessibleName(/switch to dark mode/i);

    await user.click(toggle());
    expect(probe()).toBe("dark");
  });

  it("toggles the dark class and color-scheme on the root element", async () => {
    const user = userEvent.setup();
    renderToggle();

    expect(document.documentElement).toHaveClass("dark");
    expect(document.documentElement.style.colorScheme).toBe("dark");

    await user.click(toggle());

    expect(document.documentElement).not.toHaveClass("dark");
    expect(document.documentElement.style.colorScheme).toBe("light");
  });

  it("persists the chosen theme", async () => {
    const user = userEvent.setup();
    renderToggle();

    await user.click(toggle());
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");

    await user.click(toggle());
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("defaults to dark for a first-time visitor", () => {
    renderToggle();
    expect(probe()).toBe("dark");
  });

  it.each([
    ["system", "a value from the removed system mode"],
    ["auto", "an invented value"],
    ["monitor", "another invented value"],
    ["device", "yet another"],
    ["", "an empty string"],
  ])("falls back to dark for %s — %s", (stored) => {
    window.localStorage.setItem(THEME_STORAGE_KEY, stored);
    renderToggle();
    expect(probe()).toBe("dark");
    // The invalid value is rewritten, so the key can only ever hold light/dark.
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("honours a valid stored value", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "light");
    renderToggle();
    expect(probe()).toBe("light");
  });

  it("does not write to storage on mount, so it cannot clobber another tab", () => {
    const setItem = jest.spyOn(Storage.prototype, "setItem");
    renderToggle();
    expect(setItem).not.toHaveBeenCalled();
    setItem.mockRestore();
  });

  it("still themes correctly when localStorage throws (private browsing)", () => {
    const getItem = jest
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation(() => {
        throw new Error("SecurityError");
      });
    const setItem = jest
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("SecurityError");
      });

    expect(() => renderToggle()).not.toThrow();
    expect(probe()).toBe("dark");

    getItem.mockRestore();
    setItem.mockRestore();
  });

  it("survives rapid toggling and lands on a valid theme", async () => {
    const user = userEvent.setup();
    renderToggle();

    for (let i = 0; i < 8; i += 1) {
      await user.click(toggle());
    }

    expect(["light", "dark"]).toContain(probe());
    expect(["light", "dark"]).toContain(
      window.localStorage.getItem(THEME_STORAGE_KEY)
    );
  });

  it("syncs a theme change made in another tab", () => {
    renderToggle();
    expect(probe()).toBe("dark");

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: THEME_STORAGE_KEY,
          newValue: "light",
        })
      );
    });

    expect(probe()).toBe("light");
    expect(document.documentElement).not.toHaveClass("dark");
  });

  it("ignores storage events for unrelated keys and invalid values", () => {
    renderToggle();

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", { key: "other", newValue: "light" })
      );
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: THEME_STORAGE_KEY,
          newValue: "system",
        })
      );
    });

    expect(probe()).toBe("dark");
  });

  it("removes its storage listener on unmount", () => {
    const remove = jest.spyOn(window, "removeEventListener");
    const { unmount } = renderToggle();
    unmount();
    expect(remove).toHaveBeenCalledWith("storage", expect.any(Function));
    remove.mockRestore();
  });

  it("keeps the mobile browser chrome colour in step with the theme", async () => {
    const user = userEvent.setup();
    // The tag lives in <head> and has no role, so it cannot be reached with a
    // Testing Library query. Seeded directly for that reason.
    document.head.innerHTML = '<meta name="theme-color" content="#111827" />';
    const selector = 'meta[name="theme-color"]';
    // eslint-disable-next-line testing-library/no-node-access
    const themeColor = () => document.querySelector(selector).content;

    renderToggle();
    expect(themeColor()).toBe("#111827");

    await user.click(toggle());
    expect(themeColor()).toBe("#f59e0b");
  });
});
