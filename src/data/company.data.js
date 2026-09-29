import {
  Award,
  Handshake,
  IndianRupee,
  MapPinned,
  ShieldCheck,
  Sparkles,
  Timer,
  Users,
} from "lucide-react";

import siteConfig from "../config/site.config";

/**
 * Cross-feature company content.
 *
 * Stats, milestones and values are shown on both the home and about pages, so
 * they deliberately do not live inside either feature's data folder. Keeping
 * one copy is what stops the two pages from quietly disagreeing about how many
 * screens the network runs.
 *
 * Anything that is a *fact about the business* rather than page copy — phone
 * number, service areas, opening hours — belongs in `config/site.config.js` and
 * is read from there below.
 */

/**
 * Headline numbers.
 *
 * `value` is a plain number so it can be counted up on scroll; `suffix` is
 * rendered verbatim. Edit the numbers here and every page that shows them
 * updates, including the `aggregateRating`-free JSON-LD that reads nothing from
 * here.
 */
export const companyStats = [
  { id: "screens", value: 100, suffix: "+", label: "Active digital screens" },
  { id: "clients", value: 250, suffix: "+", label: "Brands served" },
  { id: "years", value: 6, suffix: "", label: "Years in Visakhapatnam" },
  { id: "reach", value: 24, suffix: "/7", label: "Campaigns running" },
];

/** Timeline entries for the about page, newest last. */
export const milestones = [
  {
    id: "2019",
    year: "2019",
    title: "Founded in Gajuwaka",
    body: "Started with a single LED screen outside a busy junction and a simple promise: fair pricing, same-day creative changes.",
  },
  {
    id: "2021",
    year: "2021",
    title: "Tea cup printing launched",
    body: "Added hyper-local tea stall and office counter branding, which turned out to be the cheapest high-frequency reach in the city.",
  },
  {
    id: "2022",
    year: "2022",
    title: "Mobile advertising fleet",
    body: "Took delivery vehicles and tempo vans on the road, carrying video across Gajuwaka, MVP Colony and the Dwaraka Nagar bypass.",
  },
  {
    id: "2023",
    year: "2023",
    title: "In-house production",
    body: "Brought ad film, photography and editing under one roof so a campaign no longer waits on three vendors.",
  },
  {
    id: "2024",
    year: "2024",
    title: "Digital and web practice",
    body: "Added SEO, performance marketing and website building for clients who need both screens and search presence.",
  },
  {
    id: "2025",
    year: "2025",
    title: "Sri Simbha Ad Solution",
    body: "Rebranded around a single studio — brand, film, digital and outdoor — so clients brief one team instead of five.",
  },
];

/** Four values, rendered as cards on the about page. */
export const values = [
  {
    id: "honest-pricing",
    icon: IndianRupee,
    title: "Honest Pricing",
    body: "One written quote covering screen, creative and installation. No per-insert surprises when the invoice arrives.",
  },
  {
    id: "fast-turnaround",
    icon: Timer,
    title: "Same-Day Changes",
    body: "Send the new creative before lunch and it is live before evening traffic. Speed is the whole point of a digital screen.",
  },
  {
    id: "local-expertise",
    icon: MapPinned,
    title: "Local Knowledge",
    body: "We know which junction sells footwear and which tea stall serves office-goers. Placement beats volume every time.",
  },
  {
    id: "own-everything",
    icon: ShieldCheck,
    title: "One Team, End to End",
    body: "Strategy, design, filming, installation and reporting are handled in-house, so nothing gets lost between vendors.",
  },
];

/** "Why businesses pick us" — reassurance aimed at a first-time buyer. */
export const whyChooseUs = [
  {
    id: "no-lock-in",
    icon: Handshake,
    title: "No Long Lock-Ins",
    body: "Monthly and weekly plans available. If a screen is not working for you, we would rather fix it than trap you.",
  },
  {
    id: "measured-placement",
    icon: Award,
    title: "Documented Placement",
    body: "Every screen comes with photographs, map pins and footfall context, so you can audit exactly what you paid for.",
  },
  {
    id: "creative-included",
    icon: Sparkles,
    title: "Creative Included",
    body: "Design, copywriting and resizing for every format are part of the package, not an upsell on top of it.",
  },
  {
    id: "one-account",
    icon: Users,
    title: "A Single Point of Contact",
    body: "One WhatsApp number and one e-mail address reach the person who can actually make the change.",
  },
];

/** Service areas, reused from the business config so the two cannot drift. */
export const serviceAreas = siteConfig.business.areaServed;

/** What a first-time client actually needs to hear, in their own words. */
export const clientTypes = [
  {
    id: "retail",
    title: "Retail & Showrooms",
    body: "Pull walk-ins from the road into the store with screens at the entrance, counter and billing point.",
  },
  {
    id: "fnb",
    title: "Restaurants & Cafes",
    body: "Daily-changing menus, offers and combos on screens your customers are already looking at while they wait.",
  },
  {
    id: "real-estate",
    title: "Real Estate & Builders",
    body: "Project launches and site boards that stay current long after the hoarding goes up.",
  },
  {
    id: "education",
    title: "Schools & Colleges",
    body: "Admission windows, results and event notices on parent-facing screens, in Telugu and English.",
  },
  {
    id: "hospitals",
    title: "Hospitals & Clinics",
    body: "Wayfinding, department lists and health-awareness messaging at the point where attention is highest.",
  },
  {
    id: "startups",
    title: "Startups & New Brands",
    body: "Launch campaigns sized for a bootstrap budget, built to be scaled once the numbers justify it.",
  },
];

export { siteConfig };
