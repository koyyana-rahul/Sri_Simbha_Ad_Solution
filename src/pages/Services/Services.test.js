import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Services from "./Services";
import services from "../../config/services.config";

const renderPage = () =>
  render(
    <MemoryRouter>
      <Services />
    </MemoryRouter>
  );

describe("Services page", () => {
  it("has exactly one level-1 heading", () => {
    renderPage();
    expect(
      screen.getByRole("heading", { level: 1, name: /our services/i })
    ).toBeInTheDocument();
  });

  it("renders one link per registered service", () => {
    renderPage();

    // The page now legitimately contains more than one list (the breadcrumb
    // trail is an <ol>), so the service grid is targeted by its own label
    // rather than by being the only list on the page.
    const grid = screen.getByRole("list", { name: "All services" });
    const items = within(grid).getAllByRole("listitem");
    expect(items).toHaveLength(services.length);

    services.forEach((service) => {
      expect(
        screen.getByRole("link", { name: `${service.title} — learn more` })
      ).toHaveAttribute("href", service.path);
    });
  });

  it("renders no nested interactive elements inside the service links", () => {
    renderPage();

    const serviceLink = screen.getByRole("link", {
      name: /LED Display Ads — learn more/,
    });

    // A link must not contain another interactive control.
    expect(within(serviceLink).queryByRole("button")).not.toBeInTheDocument();
  });

  it("keeps the contact call to action", () => {
    renderPage();
    // `/services/contact` used to be a second, duplicate-content URL for the
    // same page. The CTA now points at the canonical `/contact`; the old path
    // survives as a redirect in `app/routes.js`.
    expect(
      screen.getByRole("link", { name: /contact us today/i })
    ).toHaveAttribute("href", "/contact");
  });

  it("offers a breadcrumb trail back to the home page", () => {
    renderPage();
    const trail = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(trail).getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/"
    );
  });
});
