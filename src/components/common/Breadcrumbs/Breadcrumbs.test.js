import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import Breadcrumbs from "./Breadcrumbs";

const ITEMS = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "LED Display Ads", path: "/services/led" },
];

const renderTrail = (items = ITEMS) =>
  render(
    <MemoryRouter>
      <Breadcrumbs items={items} />
    </MemoryRouter>
  );

/**
 * Reads the JSON-LD tag the component injects into `<head>`.
 *
 * Testing Library queries the accessibility tree, and a
 * `<script type="application/ld+json">` has no role, name or accessible
 * content — there is no Testing Library query that can reach it. Asserting on
 * structured data therefore has to read the node directly, so the lint rule is
 * disabled here and nowhere else.
 */
const JSON_LD_SELECTOR = 'script[data-managed-by-structured-data="true"]';

const findStructuredDataTag = () =>
  // eslint-disable-next-line testing-library/no-node-access
  document.querySelector(JSON_LD_SELECTOR);

const readStructuredData = () => {
  const script = findStructuredDataTag();
  return script ? JSON.parse(script.textContent) : null;
};

const hasStructuredDataTag = () => Boolean(findStructuredDataTag());

describe("Breadcrumbs", () => {
  it("is exposed as a labelled breadcrumb navigation", () => {
    renderTrail();
    expect(
      screen.getByRole("navigation", { name: "Breadcrumb" })
    ).toBeInTheDocument();
  });

  it("links every crumb except the current page", () => {
    renderTrail();

    const trail = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(trail).getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/"
    );
    expect(
      within(trail).getByRole("link", { name: "Services" })
    ).toHaveAttribute("href", "/services");
  });

  it("marks the last crumb as the current page instead of linking it", () => {
    renderTrail();

    const trail = screen.getByRole("navigation", { name: "Breadcrumb" });
    const current = within(trail).getByText("LED Display Ads");

    expect(current).toHaveAttribute("aria-current", "page");
    expect(current.tagName).toBe("SPAN");
    // A current-page crumb must not be focusable: activating it would reload
    // the page the visitor is already on.
    expect(
      within(trail).queryByRole("link", { name: "LED Display Ads" })
    ).toBeNull();
  });

  it("emits a BreadcrumbList JSON-LD graph matching the visible trail", () => {
    renderTrail();

    const parsed = readStructuredData();
    expect(parsed).not.toBeNull();
    expect(parsed["@type"]).toBe("BreadcrumbList");
    expect(parsed.itemListElement).toHaveLength(3);
    expect(parsed.itemListElement[2].name).toBe("LED Display Ads");
  });

  it("escapes angle brackets so content cannot break out of the script tag", () => {
    renderTrail([{ name: "<script>alert(1)</script>", path: "/" }]);

    const script = readStructuredData();
    expect(script).not.toBeNull();
    expect(script.itemListElement[0].name).toBe("<script>alert(1)</script>");
  });

  it("removes its JSON-LD tag on unmount so it cannot leak between routes", () => {
    const { unmount } = renderTrail();
    expect(hasStructuredDataTag()).toBe(true);

    unmount();

    expect(hasStructuredDataTag()).toBe(false);
  });

  it("renders nothing when given no items", () => {
    const { container } = renderTrail([]);
    expect(container).toBeEmptyDOMElement();
  });

  it("respects an explicit current flag on a non-final crumb", async () => {
    const user = userEvent.setup();
    renderTrail([
      { name: "Home", path: "/", current: true },
      { name: "Services", path: "/services" },
    ]);

    const trail = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(trail).getByText("Home").getAttribute("aria-current")).toBe(
      "page"
    );
    // The final crumb is still a link, because it is not the current page.
    expect(
      within(trail).getByRole("link", { name: "Services" })
    ).toBeInTheDocument();
    await user;
  });
});
