import siteConfig, {
  buildMailTo,
  buildTelUrl,
  buildWhatsAppUrl,
} from "./site.config";
import { navigationItems, footerNavigation } from "./navigation.config";
import services, {
  getServiceByPath,
  marqueeSecondaryServices,
} from "./services.config";

describe("siteConfig", () => {
  it("exposes a full international phone number for tel: links", () => {
    expect(buildTelUrl()).toBe("tel:+918790359681");
  });

  it("builds a mailto link with an encoded subject", () => {
    const mailto = buildMailTo();
    expect(
      mailto.startsWith(`mailto:${siteConfig.contact.email}?subject=`)
    ).toBe(true);
  });

  it("builds a WhatsApp deep link with an encoded message", () => {
    const url = buildWhatsAppUrl("Hello there");
    expect(url).toBe(
      `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(
        "Hello there"
      )}`
    );
  });

  it("has no trailing slash on the canonical url", () => {
    expect(siteConfig.url.endsWith("/")).toBe(false);
  });

  it("only uses https external links", () => {
    siteConfig.social.forEach((social) => {
      expect(social.href.startsWith("https://")).toBe(true);
    });
  });
});

describe("navigationItems", () => {
  it("exposes the four primary pages exactly once", () => {
    expect(navigationItems.map((item) => item.label)).toEqual([
      "Home",
      "Services",
      "About Us",
      "Contact Us",
    ]);
  });

  it("gives every item a unique id and an absolute path", () => {
    const ids = navigationItems.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    navigationItems.forEach((item) => {
      expect(item.path.startsWith("/")).toBe(true);
    });
  });

  it("reuses the primary navigation for the footer column", () => {
    footerNavigation.forEach((footerItem) => {
      expect(navigationItems).toContainEqual(footerItem);
    });
  });
});

describe("services registry", () => {
  it("declares the six services in their original display order", () => {
    expect(services.map((service) => service.title)).toEqual([
      "LED Display Ads",
      "Tea Cup Printing Ads",
      "Digital Marketing",
      "Website Building",
      "Ads on Wheels",
      "Making Ad Films",
    ]);
  });

  it("keeps the original, already-indexed urls as the canonical path", () => {
    expect(services.map((service) => service.path)).toEqual([
      "/services/led",
      "/services/tea_cup",
      "/services/digital_marketing",
      "/services/website_building",
      "/services/ad_on_wheels",
      "/services/ad_films",
    ]);
  });

  it("resolves both the canonical path and its kebab-case alias", () => {
    expect(getServiceByPath("/services/ad_films").id).toBe("ad-films");
    expect(getServiceByPath("/services/ad-films").id).toBe("ad-films");
  });

  it("returns undefined for an unknown service", () => {
    expect(getServiceByPath("/services/does-not-exist")).toBeUndefined();
  });

  it("gives every service the content the detail page needs", () => {
    services.forEach((service) => {
      expect(service.heading).toBeTruthy();
      expect(service.longDescription).toBeTruthy();
      expect(service.description).toBeTruthy();
      expect(service.benefits.length).toBeGreaterThan(0);
      expect(service.gallery.length).toBeGreaterThan(0);
      expect(service.icon).toBeDefined();
    });
  });

  it("describes every gallery image for screen readers", () => {
    services.forEach((service) => {
      service.gallery.forEach((image) => {
        expect(image.src).toBeTruthy();
        expect(typeof image.alt).toBe("string");
        expect(image.alt.length).toBeGreaterThan(10);
      });
    });
  });

  it("stores every benefit as 'Title: detail'", () => {
    services.forEach((service) => {
      service.benefits.forEach((benefit) => {
        expect(benefit).toMatch(/^[^:]+:\s*\S/);
      });
    });
  });

  it("does not declare a service path twice", () => {
    const paths = services.flatMap((service) => [
      service.path,
      ...service.aliases,
    ]);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("keeps the marquee caption list", () => {
    expect(marqueeSecondaryServices).toEqual([
      "SEO",
      "Influencer Marketing",
      "Strategy",
    ]);
  });
});
