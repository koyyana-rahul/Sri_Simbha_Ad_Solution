import { Eye, Target, Users2 } from "lucide-react";

/**
 * About page narrative copy.
 *
 * This used to be generic SaaS boilerplate — "Welcome to our platform", "enhance
 * user experience", "innovative and efficient solutions" — which described no
 * business that sells LED screens and tea cups in Visakhapatnam. It now says
 * what the company actually does and who it does it for.
 *
 * Supporting content (stats, milestones, values, service areas) lives in
 * `src/data/company.data.js` because it is shared with the home page.
 */
export const aboutPage = {
  title: "About Us",
  metaTitle: "About Sri Simbha Ad Solution",
  intro:
    "We are an advertising agency based in Gajuwaka, Visakhapatnam. Since 2019 we have been putting brands in front of people who are already on the move — on LED screens in busy junctions, printed on the tea cup they are holding, on a vehicle that drives past their house, and on the phone in their hand.",

  story: [
    "We started with one screen. It went up outside a busy junction in Gajuwaka, and the owner of the shop next door asked whether we would put his number on it too. He did, and so did the shop after him. That was the whole business at the start: a screen people actually looked at, and a number they could call.",
    "What has changed is the range. We still run those screens, and we now also print on tea cups, put video on vehicles, film advertisements, build websites and run digital campaigns. What has not changed is the way the work gets done — one team, a written quote, and a creative change live the same day you ask for it.",
    "Most of our clients come to us after trying a poster. Posters cost almost nothing and are usually ignored within a day. A screen in the right place costs more and is seen by the same people several times a week, which is the difference between advertising and decoration.",
  ],

  principles: [
    {
      id: "vision",
      icon: Eye,
      title: "Our Vision",
      body: "To be the advertising partner Visakhapatnam businesses call first, and keep calling, because we make every rupee of media spend accountable rather than merely visible.",
    },
    {
      id: "mission",
      icon: Target,
      title: "Our Mission",
      body: "To make out-of-home advertising affordable and measurable for local businesses — with honest placement, creative written for the screen it appears on, and reporting that says plainly which locations earned their keep.",
    },
  ],

  team: {
    icon: Users2,
    title: "Our Team",
    body: "A small in-house team in Visakhapatnam: media planners who walk the junctions and count footfall, designers who build the creative, an edit suite for ad films, and installers who have screens up before the morning peak. You brief one team, not five vendors, and the same WhatsApp number reaches the person who can actually make the change.",
  },

  breadcrumbs: [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
  ],
};
