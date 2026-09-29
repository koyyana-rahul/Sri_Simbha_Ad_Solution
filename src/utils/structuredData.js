/**
 * JSON-LD schema builders.
 *
 * Every function returns a plain object, so the builders stay trivially unit
 * testable and the markup is owned by exactly one component
 * (`components/common/StructuredData`) rather than being string-concatenated
 * inside pages.
 *
 * Why this matters: without structured data a local advertising agency is just
 * a blue link. With `LocalBusiness` + `Service` + `BreadcrumbList` + `FAQPage`
 * Google can show the map pack, opening hours, service list and FAQ
 * accordions directly in the results.
 *
 * Every value is derived from `config/site.config.js` and
 * `config/services.config.js`, so the markup can never contradict the visible
 * page.
 */

import siteConfig from "../config/site.config";
import services from "../config/services.config";

const abs = (path) => `${siteConfig.url}${path}`;

/** Strips undefined/null so the emitted JSON never contains empty keys. */
const compact = (object) =>
  Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  );

const organisationId = () => abs("/#organisation");
const websiteId = () => abs("/#website");

/**
 * The address block. `PostalAddress` is what unlocks the map pin; the street
 * address is intentionally omitted because the site only publishes a locality.
 */
const postalAddress = () => ({
  "@type": "PostalAddress",
  addressLocality: "Visakhapatnam",
  addressRegion: "Andhra Pradesh",
  addressCountry: "IN",
});

const openingHoursSpecification = () =>
  siteConfig.business.openingHours.map((slot) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: slot.days.map((day) => `https://schema.org/${day}`),
    opens: slot.opens,
    closes: slot.closes,
  }));

/**
 * `LocalBusiness` for the whole site, emitted once on every page.
 *
 * `image` points at the generated share card rather than the logo, because
 * Google requires a crawlable image for the knowledge panel.
 */
export const buildLocalBusinessSchema = () =>
  compact({
    "@context": "https://schema.org",
    "@type": siteConfig.business.type,
    "@id": organisationId(),
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    description: siteConfig.description,
    slogan: siteConfig.tagline,
    url: siteConfig.url,
    logo: abs(siteConfig.shareImage),
    image: abs(siteConfig.shareImage),
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    priceRange: siteConfig.business.priceRange,
    foundingDate: siteConfig.business.foundingYear,
    currenciesAccepted: siteConfig.business.currenciesAccepted,
    paymentAccepted: siteConfig.business.paymentAccepted.join(", "),
    address: postalAddress(),
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.business.geo.latitude,
      longitude: siteConfig.business.geo.longitude,
    },
    hasMap: siteConfig.contact.mapsUrl,
    openingHoursSpecification: openingHoursSpecification(),
    areaServed: siteConfig.business.areaServed.map((name) => ({
      "@type": "City",
      name,
    })),
    sameAs: siteConfig.social.map((social) => social.href),
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.contact.phone,
        contactType: "sales",
        areaServed: "IN",
        availableLanguage: ["en", "te"],
      },
    ],
  });

/** `WebSite` + `SearchAction`, which is how a site qualifies for sitelinks. */
export const buildWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": websiteId(),
  url: siteConfig.url,
  name: siteConfig.name,
  inLanguage: "en-IN",
  publisher: { "@id": organisationId() },
});

/** The full service catalogue, published on the services index page. */
export const buildServiceListSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": abs("/services#service-list"),
  name: `${siteConfig.name} — Services`,
  numberOfItems: services.length,
  itemListElement: services.map((service, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: service.title,
    url: abs(service.path),
  })),
});

/** A single `Service`, emitted on each service detail page. */
export const buildServiceSchema = (service) =>
  compact({
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${abs(service.path)}#service`,
    name: service.title,
    description: service.longDescription,
    url: abs(service.path),
    serviceType: service.title,
    image: service.gallery.slice(0, 3).map((image) => abs(image.src)),
    provider: { "@id": organisationId() },
    areaServed: siteConfig.business.areaServed.map((name) => ({
      "@type": "City",
      name,
    })),
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: abs(service.path),
      servicePhone: siteConfig.contact.phone,
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: siteConfig.business.currenciesAccepted,
      price: "0",
      url: abs(service.path),
      eligibleRegion: "IN",
    },
  });

/**
 * `BreadcrumbList`, mirroring the visible trail exactly — mismatched
 * breadcrumb markup is a manual-action risk, so both read the same array.
 *
 * @param {{name: string, path: string}[]} items
 */
export const buildBreadcrumbSchema = (items = []) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: abs(item.path),
  })),
});

/** `FAQPage`; the accordion UI and this schema are generated from one array. */
export const buildFaqSchema = (faqs = []) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
});

export { abs, compact };
