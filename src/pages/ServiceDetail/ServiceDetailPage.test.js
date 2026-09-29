import { render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import ServiceDetailPage from "./ServiceDetailPage";

const renderAt = (slug) =>
  render(
    <MemoryRouter initialEntries={[`/services/${slug}`]}>
      <Routes>
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
        <Route path="/404" element={<h1>Not found</h1>} />
      </Routes>
    </MemoryRouter>
  );

describe("ServiceDetailPage", () => {
  it("renders the LED service from its original underscore-free path", () => {
    renderAt("led");
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /our led display solutions/i,
      })
    ).toBeInTheDocument();
  });

  it("renders the same service from its kebab-case alias", () => {
    renderAt("ad-films");
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /our ad film making solutions/i,
      })
    ).toBeInTheDocument();
  });

  it("lists the key benefits with a title and a detail", () => {
    renderAt("tea-cup");

    expect(
      screen.getByRole("heading", { name: /key benefits/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/cost-effective marketing/i)).toBeInTheDocument();
    expect(
      screen.getByText(/reach potential customers affordably/i)
    ).toBeInTheDocument();
  });

  it("exposes every gallery image as a real, labelled button", () => {
    renderAt("website-building");

    const buttons = screen.getAllByRole("button", {
      name: /open larger view of/i,
    });
    expect(buttons.length).toBeGreaterThan(0);
    buttons.forEach((button) => expect(button.tagName).toBe("BUTTON"));
  });

  it("opens the lightbox on click and closes it with Escape", async () => {
    const user = userEvent.setup();
    renderAt("digital-marketing");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(
      screen.getAllByRole("button", { name: /open larger view of/i })[0]
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByRole("img")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
  });

  it("closes the lightbox with the close button", async () => {
    const user = userEvent.setup();
    renderAt("ad-on-wheels");

    await user.click(
      screen.getAllByRole("button", { name: /open larger view of/i })[0]
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /close preview/i }));

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    );
  });

  it("falls back to a not-found view for an unknown slug", () => {
    renderAt("not-a-service");
    expect(
      screen.getByRole("heading", { name: /page not found/i })
    ).toBeInTheDocument();
  });
});
