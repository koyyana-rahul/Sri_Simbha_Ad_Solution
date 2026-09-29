import fs from "fs";
import path from "path";

import services from "../config/services.config";

/**
 * Layout-token regression guards.
 *
 * Two real defects came out of hardcoded numbers:
 *
 *  1. `--header-height` existed as `4.5rem`/`4rem` but was referenced nowhere
 *     and was wrong (72/64px against a real 83/75px), so pages guessed an
 *     offset instead. About and Contact used `pt-20` (80px) and under-cleared
 *     the 83px fixed header by 3px at every width from 640px up.
 *
 *  2. About separated its major blocks with `mt-16` on the first two and
 *     `mt-20` on the other five — one job, two values, and a visible change of
 *     rhythm partway down the page.
 *
 * jsdom has no layout engine, so these cannot be asserted by rendering. Reading
 * the source is the only way to catch the *cause* rather than a downstream
 * symptom, so the checks below pin the tokens and the usages that depend on
 * them.
 */
/**
 * Reads a source file with its comments removed.
 *
 * Several of the assertions below forbid specific strings — `pt-20`,
 * `min-h-viewport`, the old `4.5rem` token. Those strings legitimately appear
 * in the explanatory comments that record *why* they were removed, so a naive
 * substring match fails on the documentation. Stripping comments first makes the
 * assertion about the code, not the prose.
 */
const read = (rel) =>
  fs
    .readFileSync(path.resolve(__dirname, "..", rel), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");

describe("design tokens", () => {
  const variables = read("styles/variables.css");

  it("derives the header height from the header's own geometry", () => {
    expect(variables).toMatch(/--header-logo:\s*50px/);
    expect(variables).toMatch(/--header-pad-y:\s*12px/);
    expect(variables).toMatch(
      /--header-height:\s*calc\([\s\S]*?--header-logo[\s\S]*?--header-pad-y/
    );
  });

  it("no longer carries the stale hardcoded header heights", () => {
    expect(variables).not.toMatch(/--header-height:\s*4\.5rem/);
    expect(variables).not.toMatch(/--header-height-mobile/);
  });

  it("steps the header padding up at the sm breakpoint", () => {
    expect(variables).toMatch(
      /@media \(min-width: 640px\)[\s\S]*?--header-pad-y:\s*16px/
    );
  });

  it("defines a page top gap so the header offset is not guessed per page", () => {
    expect(variables).toMatch(/--page-top-gap:/);
  });
});

describe("header", () => {
  const globals = read("styles/globals.css");
  const header = read("components/layout/Header/Header.js");

  it("does not clip its children (this once broke the mobile menu)", () => {
    const start = globals.indexOf(".site-header {");
    expect(start).toBeGreaterThan(-1);
    expect(globals.slice(start, globals.indexOf("}", start))).not.toMatch(
      /overflow\s*:/
    );
  });

  it("sizes the logo from the shared token, not a literal", () => {
    const start = globals.indexOf(".logo-container {");
    const block = globals.slice(start, globals.indexOf("}", start));
    expect(block).toMatch(/var\(--header-logo\)/);
    expect(block).not.toMatch(/width:\s*50px/);
  });

  it("takes its vertical padding from the shared token", () => {
    expect(header).toMatch(/py-header/);
    // The literal padding it replaced must be gone.
    expect(header).not.toMatch(/py-3 sm:py-4/);
  });
});

describe("page-scoped header clearance", () => {
  const globals = read("styles/globals.css");

  it("exposes a header-relative padding utility", () => {
    expect(globals).toMatch(
      /\.pt-header\s*\{[\s\S]*?var\(--header-height\)[\s\S]*?var\(--page-top-gap\)/
    );
  });

  it.each([["About/About.js"], ["Contact/Contact.js"]])(
    "%s clears the header with the token rather than a hardcoded padding",
    (rel) => {
      const src = read("pages/" + rel);
      expect(src).toMatch(/pt-header/);
      expect(src).not.toMatch(/\bpt-20\b/);
    }
  );

  it("leaves pages that already cleared the header alone", () => {
    // Services and ServiceDetail offset with `mt-16` and measured +21/+29 of
    // clearance, so they must not be pulled into this change.
    expect(read("pages/Services/Services.js")).not.toMatch(/pt-header/);
    expect(read("pages/ServiceDetail/ServiceDetailPage.js")).not.toMatch(
      /pt-header/
    );
  });
});

describe("About page rhythm", () => {
  const about = read("pages/About/About.js");

  it("separates every major block with one token", () => {
    // The capture group is the part after `mt-`, so a uniform
    // `z-10 mt-section` on every block reads as the single value "section".
    const seps = [...about.matchAll(/z-10 mt-(\S+)/g)].map((m) => m[1]);
    expect(seps.length).toBeGreaterThan(0);
    expect([...new Set(seps)]).toEqual(["section"]);
  });

  it("no longer mixes the two old values", () => {
    expect(about).not.toMatch(/z-10 mt-16\b/);
    expect(about).not.toMatch(/z-10 mt-20\b/);
  });

  it("drops the meaningless viewport minimum from a very long section", () => {
    expect(about).not.toMatch(/min-h-viewport/);
  });
});

describe("service registry is untouched by the layout work", () => {
  it("still declares the six services and their canonical paths", () => {
    expect(services).toHaveLength(6);
    expect(services.map((s) => s.path)).toEqual([
      "/services/led",
      "/services/tea_cup",
      "/services/digital_marketing",
      "/services/website_building",
      "/services/ad_on_wheels",
      "/services/ad_films",
    ]);
  });
});
