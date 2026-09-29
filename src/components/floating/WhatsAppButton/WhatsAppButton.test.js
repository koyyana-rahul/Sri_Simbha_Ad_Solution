import { render, screen } from "@testing-library/react";

import WhatsAppButton from "./WhatsAppButton";
import siteConfig from "../../../config/site.config";

describe("WhatsAppButton", () => {
  it("exposes an accessible label", () => {
    render(<WhatsAppButton />);
    expect(
      screen.getByRole("link", {
        name: /chat with sri simbha ad solution on whatsapp/i,
      })
    ).toBeInTheDocument();
  });

  it("opens a prefilled WhatsApp deep link in a new tab, safely", () => {
    render(<WhatsAppButton />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link.getAttribute("href")).toContain(
      `https://wa.me/${siteConfig.contact.whatsappNumber}`
    );
    expect(link.getAttribute("href")).toContain(encodeURIComponent("Simbha"));
  });

  it("uses a caller-supplied message when provided", () => {
    render(<WhatsAppButton message="Tell me about LED ads" />);

    expect(screen.getByRole("link").getAttribute("href")).toContain(
      encodeURIComponent("Tell me about LED ads")
    );
  });
});
