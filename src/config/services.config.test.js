import fs from "fs";
import path from "path";

import services, { getServiceByPath } from "./services.config";

/**
 * Service data integrity.
 *
 * There have been repeated reports that clicking a related-service link at the
 * bottom of a service page "opens the destination but some of its content is
 * missing". That was traced end to end and could not be reproduced: the
 * detail page resolves the service synchronously from this registry via the
 * route slug, so there is no async layer where a partial payload or a stale
 * response could arise.
 *
 * This file is the guard that keeps it that way. It pins the invariants a
 * partial-load regression would break — most obviously an accidental
 * `.slice()`, a flattening of `benefits`, or a `key` collision — so the next
 * change that truncates the data fails here rather than in production.
 */

/** Fields the detail page renders. `benefits` and `gallery` are the two most
 *  likely to be truncated, so they get the most explicit coverage. */
const RENDERED_FIELDS = [
  "id",
  "title",
  "shortTitle",
  "path",
  "description",
  "heading",
  "longDescription",
  "benefits",
  "gallery",
];

describe("service registry shape", () => {
  it("declares the six real services", () => {
    expect(services.map((s) => s.id)).toEqual([
      "led",
      "tea-cup",
      "digital-marketing",
      "website-building",
      "ad-on-wheels",
      "ad-films",
    ]);
  });

  it.each(RENDERED_FIELDS)("every service declares %s", (field) => {
    services.forEach((service) => {
      expect(service).toHaveProperty(field);
      const value = service[field];
      expect(value).toBeTruthy();
    });
  });

  it("gives every service a unique id, canonical path and title", () => {
    const unique = (pick) =>
      new Set(services.map(pick)).size === services.length;
    expect(unique((s) => s.id)).toBe(true);
    expect(unique((s) => s.path)).toBe(true);
    expect(unique((s) => s.title)).toBe(true);
  });

  it("gives every service a component icon, so no card renders an empty glyph", () => {
    services.forEach((service) => expect(service.icon).toBeDefined());
  });
});

describe("benefits (the Key Benefits section)", () => {
  it("keeps the full array for every service — never truncated to one entry", () => {
    services.forEach((service) => {
      expect(Array.isArray(service.benefits)).toBe(true);
      // All six currently carry 3; a regression to `benefits[0]` would give 1.
      expect(service.benefits.length).toBeGreaterThanOrEqual(3);
    });
  });

  it("stores each benefit as 'Title: detail' so the card splits cleanly", () => {
    services.forEach((service) => {
      service.benefits.forEach((benefit) => {
        expect(benefit).toMatch(/^[^:]+:\s*\S/);
      });
    });
  });

  it("has no duplicate benefit titles within a service (React key safety)", () => {
    services.forEach((service) => {
      const titles = service.benefits.map((b) => b.split(":")[0].trim());
      expect(new Set(titles).size).toBe(titles.length);
    });
  });

  it("gives every service a distinct set of benefit titles", () => {
    const sets = services.map((s) =>
      JSON.stringify(s.benefits.map((b) => b.split(":")[0].trim()).sort())
    );
    expect(new Set(sets).size).toBe(services.length);
  });
});

describe("gallery", () => {
  it("keeps the full array for every service", () => {
    services.forEach((service) => {
      expect(Array.isArray(service.gallery)).toBe(true);
      expect(service.gallery.length).toBeGreaterThanOrEqual(4);
    });
  });

  it("gives every image a src and a descriptive alt", () => {
    services.forEach((service) => {
      service.gallery.forEach((image) => {
        expect(image.src).toBeTruthy();
        expect(typeof image.alt).toBe("string");
        expect(image.alt.length).toBeGreaterThan(10);
      });
    });
  });

  it("has no duplicate image files within a service (React key safety)", () => {
    services.forEach((service) => {
      const srcs = service.gallery.map((i) => i.src);
      expect(new Set(srcs).size).toBe(srcs.length);
    });
  });

  it("does not share gallery files across services", () => {
    // A shared file would make it impossible to tell two services apart by
    // imagery, which is exactly the stale-content signal we guard against.
    const seen = new Map();
    services.forEach((service) => {
      service.gallery.forEach((image) => {
        if (seen.has(image.src)) {
          throw new Error(
            `${service.id} reuses ${image.src} from ${seen.get(image.src)}`
          );
        }
        seen.set(image.src, service.id);
      });
    });
    expect(seen.size).toBeGreaterThan(20);
  });
});

describe("path resolution is the single source of truth", () => {
  it("resolves the canonical path and every alias to the same object", () => {
    services.forEach((service) => {
      const viaPath = getServiceByPath(service.path);
      expect(viaPath).toBe(service);
      service.aliases.forEach((alias) => {
        expect(getServiceByPath(alias)).toBe(service);
      });
    });
  });

  it("returns undefined for an unknown slug, so the route loader can 404", () => {
    expect(getServiceByPath("/services/nope")).toBeUndefined();
  });

  it("exposes exactly one navigation path per service (no _id/slug mixing)", () => {
    const files = fs
      .readFileSync(
        path.resolve(__dirname, "../../src/config/services.config.js"),
        "utf8"
      )
      .replace(/\/\*[\s\S]*?\*\//g, "");

    // The brief warns against mixing `id`, `_id`, `slug` and `name`. This
    // project routes on `path` only; a stray Mongo-style field would signal an
    // API-shaped architecture that does not exist here.
    expect(files).not.toMatch(/\b_id\b/);
    expect(files).not.toMatch(/slug:/);
  });
});

describe("fields the brief asks about that this project does not have", () => {
  /**
   * Reported rather than fabricated. Adding `heroImage`, `features`,
   * `process`, `testimonials` or a per-service `cta` would mean inventing
   * business content, which is explicitly out of scope; the gap is recorded
   * here so it is a decision, not an oversight.
   */
  const NOT_IN_THIS_PROJECT = [
    "heroImage",
    "features",
    "process",
    "deliverables",
    "testimonials",
    "faq",
    "pricing",
    "thumbnail",
    "imageUrl",
    "images",
    "keyBenefits",
    "cta",
  ];

  it.each(NOT_IN_THIS_PROJECT)("no service declares %s", (field) => {
    services.forEach((service) => {
      expect(service).not.toHaveProperty(field);
    });
  });

  it("documents the inventory that does exist", () => {
    const keys = new Set(services.flatMap((s) => Object.keys(s)));
    expect([...keys].sort()).toEqual([
      "aliases",
      "benefits",
      "description",
      "gallery",
      "heading",
      "icon",
      "id",
      "longDescription",
      "path",
      "shortTitle",
      "title",
    ]);
  });
});
