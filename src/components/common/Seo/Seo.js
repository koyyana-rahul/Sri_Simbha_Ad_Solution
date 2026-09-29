import { useEffect } from "react";

import siteConfig from "../../../config/site.config";

/**
 * Declarative `<head>` manager for a single-page application.
 *
 * Create React App ships a static `index.html`, so per-route metadata has to be
 * applied at runtime. This component sets/updates exactly the tags it owns and
 * removes them again on unmount, which keeps titles and descriptions from
 * leaking between routes.
 *
 * Usage: `<Seo title="..." description="..." path="/services" />`
 */

const MANAGED_ATTR = "data-managed-by-seo";

const setMeta = (selector, attrs) => {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(MANAGED_ATTR, "true");
    document.head.appendChild(tag);
  }
  Object.entries(attrs).forEach(([key, value]) => {
    if (value) tag.setAttribute(key, value);
  });
  return tag;
};

const setLink = (rel, href) => {
  let tag = document.head.querySelector(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    tag.setAttribute(MANAGED_ATTR, "true");
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
  return tag;
};

const Seo = ({
  title,
  description = siteConfig.description,
  path = "/",
  image,
  type = "website",
  noIndex = false,
  children,
}) => {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | ${siteConfig.name}`
      : `${siteConfig.name} — ${siteConfig.tagline}`;

    const url = `${siteConfig.url}${path}`;
    // Falls back to the generated 1200x630 brand card. Swap in a per-service
    // asset (see README → SEO) for richer link previews.
    const shareImage = image
      ? `${siteConfig.url}${image}`
      : `${siteConfig.url}${siteConfig.shareImage}`;

    document.title = fullTitle;

    setMeta('meta[name="description"]', {
      name: "description",
      content: description,
    });
    setMeta('meta[name="robots"]', {
      name: "robots",
      content: noIndex ? "noindex, nofollow" : "index, follow",
    });
    setMeta('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: siteConfig.name,
    });
    setMeta('meta[property="og:type"]', { property: "og:type", content: type });
    setMeta('meta[property="og:title"]', {
      property: "og:title",
      content: fullTitle,
    });
    setMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    setMeta('meta[property="og:url"]', { property: "og:url", content: url });
    setMeta('meta[property="og:image"]', {
      property: "og:image",
      content: shareImage,
    });
    setMeta('meta[property="og:locale"]', {
      property: "og:locale",
      content: siteConfig.locale,
    });
    setMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    setMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: fullTitle,
    });
    setMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });
    setMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: shareImage,
    });

    setLink("canonical", url);
  }, [title, description, path, image, type, noIndex]);

  return children || null;
};

export default Seo;
