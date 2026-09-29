import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildLocalBusinessSchema,
  buildServiceListSchema,
  buildServiceSchema,
  buildWebSiteSchema,
} from "./structuredData";
import siteConfig from "../config/site.config";
import services, { getServiceByPath } from "../config/services.config";
import { faqs } from "../data/faq.data";

describe("buildLocalBusinessSchema", () => {
  const schema = buildLocalBusinessSchema();

  it("declares itself as an advertising agency with a stable @id", () => {
    expect(schema["@type"]).toBe("AdvertisingAgency");
    expect(schema["@id"]).toBe(`${siteConfig.url}/#organisation`);
  });

  it("uses absolute urls, not root-relative paths", () => {
    expect(schema.url.startsWith("https://")).toBe(true);
    expect(schema.logo.startsWith("https://")).toBe(true);
    expect(schema.image.startsWith("https://")).toBe(true);
  });

  it("carries the contact details the app actually shows", () => {
    expect(schema.telephone).toBe(siteConfig.contact.phone);
    expect(schema.email).toBe(siteConfig.contact.email);
  });

  it("points every social profile at the configured accounts", () => {
    expect(schema.sameAs).toEqual(siteConfig.social.map((s) => s.href));
  });

  it("serialises without circular references", () => {
    expect(() => JSON.stringify(schema)).not.toThrow();
  });

  it("declares opening hours for every configured day", () => {
    expect(schema.openingHoursSpecification.length).toBeGreaterThan(0);
    schema.openingHoursSpecification.forEach((slot) => {
      expect(slot.dayOfWeek.length).toBeGreaterThan(0);
      expect(slot.opens).toMatch(/^\d{2}:\d{2}$/);
    });
  });
});

describe("buildWebSiteSchema", () => {
  it("references the organisation as its publisher", () => {
    expect(buildWebSiteSchema().publisher["@id"]).toBe(
      `${siteConfig.url}/#organisation`
    );
  });
});

describe("buildServiceListSchema", () => {
  it("lists every service exactly once, in registry order", () => {
    const schema = buildServiceListSchema();
    expect(schema.numberOfItems).toBe(services.length);
    expect(schema.itemListElement.map((i) => i.name)).toEqual(
      services.map((s) => s.title)
    );
    schema.itemListElement.forEach((item, index) => {
      expect(item.position).toBe(index + 1);
      expect(item.url).toBe(`${siteConfig.url}${services[index].path}`);
    });
  });
});

describe("buildServiceSchema", () => {
  it("describes the LED service and links it to the organisation", () => {
    const service = getServiceByPath("/services/led");
    const schema = buildServiceSchema(service);

    expect(schema["@type"]).toBe("Service");
    expect(schema.name).toBe(service.title);
    expect(schema.url).toBe(`${siteConfig.url}${service.path}`);
    expect(schema.provider["@id"]).toBe(`${siteConfig.url}/#organisation`);
  });

  it("uses the canonical path even when built from the kebab-case alias", () => {
    const viaAlias = getServiceByPath("/services/ad-films");
    const viaPath = getServiceByPath("/services/ad_films");
    expect(viaAlias).toBe(viaPath);
    expect(buildServiceSchema(viaAlias).url).toBe(
      `${siteConfig.url}/services/ad_films`
    );
  });
});

describe("buildBreadcrumbSchema", () => {
  it("numbers positions from one, in the order given", () => {
    const items = [
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "LED Display Ads", path: "/services/led" },
    ];

    const schema = buildBreadcrumbSchema(items);
    expect(schema.itemListElement.map((i) => i.position)).toEqual([1, 2, 3]);
    expect(schema.itemListElement[0].item).toBe(`${siteConfig.url}/`);
    expect(schema.itemListElement[2].name).toBe("LED Display Ads");
  });

  it("returns an empty list rather than throwing when given nothing", () => {
    expect(buildBreadcrumbSchema().itemListElement).toEqual([]);
  });
});

describe("buildFaqSchema", () => {
  it("mirrors the questions rendered in the accordion", () => {
    const schema = buildFaqSchema(faqs);

    expect(schema["@type"]).toBe("FAQPage");
    expect(schema.mainEntity).toHaveLength(faqs.length);
    expect(schema.mainEntity[0].name).toBe(faqs[0].question);
    expect(schema.mainEntity[0].acceptedAnswer.text).toBe(faqs[0].answer);
  });
});
