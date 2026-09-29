import { appRouter } from "./routes";

/**
 * The Vercel analytics SDKs are loaded by `app/providers.js`, which
 * `routes.js` imports transitively. Their `/react` entry points are ESM-only
 * subpath exports and do not resolve under Jest's CJS resolver, so they are
 * stubbed here as virtual modules. Neither is involved in the route table.
 */
jest.mock("@vercel/analytics/react", () => ({ Analytics: () => null }), {
  virtual: true,
});
jest.mock(
  "@vercel/speed-insights/react",
  () => ({ SpeedInsights: () => null }),
  {
    virtual: true,
  }
);

/**
 * Structural guards on the route table.
 *
 * Regression: `errorElement` was declared only on the parent route, which
 * renders the app shell. In React Router an `errorElement` replaces its route's
 * *entire* element, so the loader throwing for an unknown service slug replaced
 * the whole shell. Measured on the built site, `/services/does-not-exist`
 * rendered a bare "Oops!" with no header, `<main>`, footer, navigation, skip
 * link or contact CTA, while an unknown top-level route kept all of them.
 *
 * These assertions catch the shape of the mistake, which is all jsdom can see.
 * The rendered consequence is covered by a browser check.
 */
const serviceRoute = () =>
  appRouter.routes[0].children.find((r) => r.path === "services/:slug");

describe("route table", () => {
  it("gives the service-detail route its own error boundary", () => {
    expect(serviceRoute().errorElement).toBeDefined();
  });

  it("keeps a last-resort boundary on the shell route", () => {
    expect(appRouter.routes[0].errorElement).toBeDefined();
  });

  it("validates the service slug in a loader before rendering", () => {
    expect(typeof serviceRoute().loader).toBe("function");
  });

  it("rejects an unknown slug with a 404 so the boundary can pick NotFound", () => {
    let thrown;
    try {
      serviceRoute().loader({ params: { slug: "definitely-not-a-service" } });
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toBeDefined();
    expect(thrown.status).toBe(404);
  });

  it("accepts every registered service path, underscore and kebab", () => {
    const accepted = [
      "led",
      "tea_cup",
      "tea-cup",
      "digital_marketing",
      "digital-marketing",
      "website_building",
      "website-building",
      "ad_on_wheels",
      "ad-on-wheels",
      "ad_films",
      "ad-films",
    ];

    accepted.forEach((slug) => {
      expect(() => serviceRoute().loader({ params: { slug } })).not.toThrow();
    });
  });

  it("redirects the legacy /services/contact alias instead of duplicating it", () => {
    const alias = appRouter.routes[0].children.find(
      (r) => r.path === "services/contact"
    );
    expect(alias.element).toBeUndefined();
    expect(typeof alias.loader).toBe("function");
  });
});
