import fs from "fs";
import path from "path";

import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import Header from "./Header";
import ThemeProvider from "../../../app/ThemeProvider";
import { MOBILE_NAV_BREAKPOINT } from "../../../utils/constants";
import { navigationItems } from "../../../config/navigation.config";

const renderHeader = (initialEntries = ["/"]) =>
  render(
    <ThemeProvider>
      <MemoryRouter initialEntries={initialEntries}>
        <Header />
      </MemoryRouter>
    </ThemeProvider>
  );

const burger = () =>
  screen.getByRole("button", {
    name: /open navigation menu|close navigation menu/i,
  });

const mobileNav = () => screen.getByRole("navigation", { name: "Mobile" });

describe("Header", () => {
  it("links the brand back to the home page", () => {
    renderHeader();
    expect(
      screen.getByRole("link", { name: /sri simbha ad solution — home/i })
    ).toHaveAttribute("href", "/");
  });

  it("renders every configured navigation item in the primary nav", () => {
    renderHeader();

    const primaryNav = screen.getByRole("navigation", { name: "Primary" });
    navigationItems.forEach((item) => {
      const link = within(primaryNav).getByRole("link", { name: item.label });
      expect(link).toHaveAttribute("href", item.path);
    });
  });

  it("marks the current route with aria-current", () => {
    renderHeader(["/about"]);

    const primaryNav = screen.getByRole("navigation", { name: "Primary" });
    expect(
      within(primaryNav).getByRole("link", { name: "About Us" })
    ).toHaveAttribute("aria-current", "page");
  });

  it("exposes the mobile menu trigger with correct expanded state", async () => {
    const user = userEvent.setup();
    renderHeader();

    const trigger = burger();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-controls", "mobile-navigation");
    expect(trigger.tagName).toBe("BUTTON");

    await user.click(trigger);

    expect(burger()).toHaveAttribute("aria-expanded", "true");
  });

  it("keeps the mobile menu trigger a comfortable touch target", () => {
    renderHeader();
    // WCAG 2.2 minimum target size.
    expect(burger()).toHaveClass("p-2");
  });

  it("opens and closes the mobile menu", async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(burger());
    expect(mobileNav()).toBeInTheDocument();

    await user.click(burger());
    expect(burger()).toHaveAttribute("aria-expanded", "false");
  });

  it("lists every navigation item inside the mobile panel", () => {
    renderHeader();

    const panel = mobileNav();
    navigationItems.forEach((item) => {
      expect(
        within(panel).getByRole("link", { name: item.label })
      ).toHaveAttribute("href", item.path);
    });
  });

  it("closes the mobile menu after choosing a destination", async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(burger());
    await user.click(
      within(mobileNav()).getByRole("link", { name: "Services" })
    );

    expect(burger()).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the mobile menu on Escape", async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(burger());
    expect(burger()).toHaveAttribute("aria-expanded", "true");

    await user.keyboard("{Escape}");
    expect(burger()).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the mobile menu when clicking outside it", async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(burger());
    expect(burger()).toHaveAttribute("aria-expanded", "true");

    await user.click(document.body);
    expect(burger()).toHaveAttribute("aria-expanded", "false");
  });

  it("does not get stuck open when the trigger is clicked repeatedly", async () => {
    const user = userEvent.setup();
    renderHeader();

    for (let i = 0; i < 6; i += 1) {
      await user.click(burger());
    }

    // An even number of clicks must land closed, not wedged open.
    expect(burger()).toHaveAttribute("aria-expanded", "false");
  });

  it("does not lock body scrolling while the menu is open", async () => {
    const user = userEvent.setup();
    const { container } = renderHeader();

    await user.click(burger());

    // A scroll lock here would leave the whole site unscrollable after close.
    expect(container.ownerDocument.body.style.overflow).toBe("");
  });

  it("shows the mobile panel below the desktop breakpoint", () => {
    renderHeader();
    // The breakpoint is a single source of truth in utils/constants.
    expect(MOBILE_NAV_BREAKPOINT).toBe(1024);
    expect(burger()).toHaveClass("lg:hidden");
  });
});

/**
 * Regression guard for a real, shipped bug.
 *
 * `overflow: hidden` was once added to `.site-header` to suppress a closed
 * mobile panel that was parked off-canvas with `translateX(100%)`. The header
 * is only ~75px tall while the panel hangs ~375px below it, so that clip cut
 * the open panel down to 5px: the button reported `aria-expanded="true"`, the
 * panel computed `visibility: visible`, and every link was unclickable —
 * `elementFromPoint` at the middle of the panel returned the hero.
 *
 * jsdom has no layout engine, so hit-testing the open menu is not possible
 * here. Asserting on the stylesheet catches the cause instead: the header must
 * not clip its children, and the closed panel must no longer be translated
 * outside the viewport (which is what required the clip in the first place).
 */
describe("mobile menu layout CSS", () => {
  const css = fs.readFileSync(
    path.resolve(__dirname, "../../../styles/globals.css"),
    "utf8"
  );

  const rule = (selector) => {
    const start = css.indexOf(selector);
    expect(start).toBeGreaterThan(-1); // the selector must exist
    return css.slice(start, css.indexOf("}", start) + 1);
  };

  it("does not clip the header, which would hide the open mobile panel", () => {
    expect(rule(".site-header {")).not.toMatch(/overflow\s*:/);
  });

  it("parks the closed panel inside the viewport instead of off-canvas", () => {
    const closed = rule(".mobile-menu--closed {");
    expect(closed).not.toMatch(/translateX/);
  });

  it("anchors the panel to the header with a relative offset, not a magic number", () => {
    const base = rule(".mobile-menu {");
    expect(base).toMatch(/top:\s*100%/);
    expect(base).not.toMatch(/top:\s*\d+px/);
    expect(base).toMatch(/inset-inline:\s*0/);
  });

  it("removes the closed panel from the tab order and from taps", () => {
    const closed = rule(".mobile-menu--closed {");
    expect(closed).toMatch(/visibility:\s*hidden/);
    expect(closed).toMatch(/pointer-events:\s*none/);
  });
});
