import {
  MonitorSmartphone,
  Coffee,
  TrendingUp,
  Globe,
  Truck,
  Video,
} from "lucide-react";

import adFilm01 from "../assets/images/ad-films/ad-film-01.jpg";
import adFilm02 from "../assets/images/ad-films/ad-film-02.jpg";
import adFilm03 from "../assets/images/ad-films/ad-film-03.jpg";
import adFilm04 from "../assets/images/ad-films/ad-film-04.jpg";
import adFilm05 from "../assets/images/ad-films/ad-film-05.jpeg";
import adFilm06 from "../assets/images/ad-films/ad-film-06.jpeg";

import wheels01 from "../assets/images/ad-on-wheels/ads-on-wheels-01.jpg";
import wheels02 from "../assets/images/ad-on-wheels/ads-on-wheels-02.jpg";
import wheels03 from "../assets/images/ad-on-wheels/ads-on-wheels-03.jpg";
import wheels04 from "../assets/images/ad-on-wheels/ads-on-wheels-04.jpg";
import wheels05 from "../assets/images/ad-on-wheels/ads-on-wheels-05.jpg";
import wheels06 from "../assets/images/ad-on-wheels/ads-on-wheels-06.jpeg";
import wheels07 from "../assets/images/ad-on-wheels/ads-on-wheels-07.jpg";

import digital01 from "../assets/images/digital-marketing/digital-marketing-01.jpg";
import digital02 from "../assets/images/digital-marketing/digital-marketing-02.jpg";
import digital03 from "../assets/images/digital-marketing/digital-marketing-03.jpg";
import digital04 from "../assets/images/digital-marketing/digital-marketing-04.jpg";
import digital05 from "../assets/images/digital-marketing/digital-marketing-05.jpg";

import led01 from "../assets/images/led/led-01.jpg";
import led02 from "../assets/images/led/led-02.jpg";
import led03 from "../assets/images/led/led-03.jpg";
import led04 from "../assets/images/led/led-04.jpg";
import led05 from "../assets/images/led/led-05.jpg";
import led06 from "../assets/images/led/led-06.jpg";
import led07 from "../assets/images/led/led-07.jpg";
import led08 from "../assets/images/led/led-08.jpeg";
import led09 from "../assets/images/led/led-09.jpeg";
import led10 from "../assets/images/led/led-10.jpg";
import led11 from "../assets/images/led/led-11.jpg";
import led12 from "../assets/images/led/led-12.jpg";

import tea01 from "../assets/images/tea-cup/tea-cup-01.jpg";
import tea02 from "../assets/images/tea-cup/tea-cup-02.jpeg";
import tea03 from "../assets/images/tea-cup/tea-cup-03.jpg";
import tea04 from "../assets/images/tea-cup/tea-cup-04.jpg";
import tea05 from "../assets/images/tea-cup/tea-cup-05.jpeg";
import tea06 from "../assets/images/tea-cup/tea-cup-06.jpg";
import tea07 from "../assets/images/tea-cup/tea-cup-07.jpeg";
import tea08 from "../assets/images/tea-cup/tea-cup-08.jpeg";
import tea09 from "../assets/images/tea-cup/tea-cup-09.jpeg";
import tea10 from "../assets/images/tea-cup/tea-cup-10.jpg";

import website01 from "../assets/images/website-building/website-01.jpg";
import website02 from "../assets/images/website-building/website-02.jpg";
import website03 from "../assets/images/website-building/website-03.jpg";
import website04 from "../assets/images/website-building/website-04.jpg";

/**
 * Canonical service registry.
 *
 * This is the only place where service content, imagery and routes are
 * declared. `/services`, the home page slideshow, the marquee, the footer and
 * the router all derive from it, so adding a service means adding one entry
 * here plus one `ServiceDetailPage` route.
 *
 * `path` keeps the original, already-indexed URL (e.g. `/services/ad_films`)
 * so existing inbound links and search rankings survive the refactor.
 * `aliases` are the kebab-case equivalents.
 */
const services = [
  {
    id: "led",
    title: "LED Display Ads",
    shortTitle: "Led Display Ads",
    path: "/services/led",
    aliases: [],
    icon: MonitorSmartphone,
    description:
      "Engage audiences with high-visibility LED display advertisements in public spaces.",
    heading: "Our LED Display Solutions",
    longDescription:
      "Showcase your business on high-resolution LED screens (32–64 inches) with 100+ displays across high-traffic areas.",
    benefits: [
      "Increased Reach: Target thousands of viewers daily by placing your business where everyone’s eyes naturally fall.",
      "High Visibility: Bright and vibrant visuals attract attention even in crowded or chaotic environments.",
      "Dynamic Advertising: Unlike static posters, LED displays allow animation, ensuring your brand stands out.",
    ],
    gallery: [
      { src: led04, alt: "Restaurant LED display advertising" },
      { src: led05, alt: "Real estate LED display advertising" },
      { src: led01, alt: "Hospital LED display advertising" },
      { src: led02, alt: "School LED display advertising" },
      { src: led06, alt: "Clothing store LED display advertising" },
      { src: led03, alt: "Jewellery store LED display advertising" },
      { src: led07, alt: "LED display advertising installation" },
      { src: led08, alt: "LED display advertising close-up" },
      { src: led09, alt: "LED display advertising campaign" },
      { src: led10, alt: "LED display advertising campaign" },
      { src: led11, alt: "Shopping mall LED display advertising" },
      { src: led12, alt: "LED display advertising in a public place" },
    ],
  },
  {
    id: "tea-cup",
    title: "Tea Cup Printing Ads",
    shortTitle: "Tea Cup Printing Ads",
    path: "/services/tea_cup",
    aliases: ["/services/tea-cup"],
    icon: Coffee,
    description:
      "Innovative advertising on tea cups for maximum brand exposure in cafes and offices.",
    heading: "Our Tea Cup Printing Solutions",
    longDescription:
      "Print your brand logo or promotional messages on tea cups, spreading awareness in even the most remote locations. Every sip brings your brand closer to customers in tea stalls, offices, and homes.",
    benefits: [
      "Cost-Effective Marketing: Reach potential customers affordably without compromising on impact.",
      "Broad Demographic Reach: Engage diverse audiences—office-goers, travelers, and residents alike.",
      "Subtle Yet Memorable: Customers interact with your brand during leisurely moments, leaving a lasting impression.",
    ],
    gallery: [
      { src: tea01, alt: "Tea cup printing advertisement sample 1" },
      { src: tea02, alt: "Tea cup printing advertisement sample 2" },
      { src: tea03, alt: "Tea cup printing advertisement sample 3" },
      { src: tea04, alt: "Tea cup printing advertisement sample 4" },
      { src: tea05, alt: "Tea cup printing advertisement sample 5" },
      { src: tea06, alt: "Tea cup printing advertisement sample 6" },
      { src: tea07, alt: "Tea cup printing advertisement sample 7" },
      { src: tea08, alt: "Tea cup printing advertisement sample 8" },
      { src: tea09, alt: "Tea cup printing advertisement sample 9" },
      { src: tea10, alt: "Tea cup printing advertisement sample 10" },
    ],
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    shortTitle: "Digital Marketing",
    path: "/services/digital_marketing",
    aliases: ["/services/digital-marketing"],
    icon: TrendingUp,
    description:
      "Boost your brand’s online presence with our expert digital marketing strategies.",
    heading: "Our Digital Marketing Solutions",
    longDescription:
      "Unlock the power of online advertising to grow your business. Harness tools like SEO, social media marketing, Google Ads, email campaigns, and content creation to connect with audiences globally.",
    benefits: [
      "Targeted Advertising: Reach the exact audience for your products or services using data-driven strategies.",
      "Increased ROI: Digital campaigns are measurable, allowing you to optimize investments effectively.",
      "24/7 Engagement: Promote your business any time, anywhere, for continuous growth.",
    ],
    gallery: [
      { src: digital01, alt: "Digital marketing campaign example 1" },
      { src: digital02, alt: "Digital marketing campaign example 2" },
      { src: digital03, alt: "Digital marketing campaign example 3" },
      { src: digital04, alt: "Digital marketing campaign example 4" },
      { src: digital05, alt: "Digital marketing campaign example 5" },
    ],
  },
  {
    id: "website-building",
    title: "Website Building",
    shortTitle: "Website Building",
    path: "/services/website_building",
    aliases: ["/services/website-building"],
    icon: Globe,
    description:
      "Get a professionally designed website tailored to your business needs.",
    heading: "Our Website Building Solutions",
    longDescription:
      "We create customized websites—dynamic or static—to suit your business goals. Whether you need an interactive platform or a straightforward information hub, we've got you covered.",
    benefits: [
      "Professional Online Presence: Enhance credibility with a modern and user-friendly website.",
      "SEO Optimized: Generate organic traffic by ranking higher on search engines.",
      "Custom Solutions: Tailored designs that reflect your brand identity perfectly.",
    ],
    gallery: [
      { src: website01, alt: "Website designed by Sri Simbha Ad Solution 1" },
      { src: website02, alt: "Website designed by Sri Simbha Ad Solution 2" },
      { src: website03, alt: "Website designed by Sri Simbha Ad Solution 3" },
      { src: website04, alt: "Website designed by Sri Simbha Ad Solution 4" },
    ],
  },
  {
    id: "ad-on-wheels",
    title: "Ads on Wheels",
    shortTitle: "Ads On Wheels",
    path: "/services/ad_on_wheels",
    aliases: ["/services/ad-on-wheels"],
    icon: Truck,
    description:
      "Mobile advertising through digital screens mounted on vehicles for dynamic and high-reach promotion.",
    heading: "Our Ads On Wheels Solutions",
    longDescription:
      "Turn your brand mobile with advertisements on vehicles. From cars to buses, your message will travel far and wide, making an impression wherever the wheels take you.",
    benefits: [
      "Extended Reach: Ads on wheels cover multiple locations, maximizing exposure across regions.",
      "High Recall: Mobile ads are unique, ensuring your brand stands out and is remembered.",
      "Versatile Locations: Reach areas where traditional advertising might struggle, such as highways or smaller towns.",
    ],
    gallery: [
      { src: wheels01, alt: "Vehicle-mounted digital advertising 1" },
      { src: wheels02, alt: "Vehicle-mounted digital advertising 2" },
      { src: wheels03, alt: "Vehicle-mounted digital advertising 3" },
      { src: wheels04, alt: "Vehicle-mounted digital advertising 4" },
      { src: wheels05, alt: "Vehicle-mounted digital advertising 5" },
      { src: wheels06, alt: "Vehicle-mounted digital advertising 6" },
      { src: wheels07, alt: "Vehicle-mounted digital advertising 7" },
    ],
  },
  {
    id: "ad-films",
    title: "Making Ad Films",
    shortTitle: "Making Ad Films",
    path: "/services/ad_films",
    aliases: ["/services/ad-films"],
    icon: Video,
    description:
      "Professional ad film production to tell your brand’s story with impact and creativity.",
    heading: "Our Ad Film Making Solutions",
    longDescription:
      "Our team produces stunning video ads tailored to your business needs. From concept creation to filming and editing, we bring your brand story to life for digital platforms or TV.",
    benefits: [
      "Compelling Storytelling: Capture your audience's attention with high-quality visuals and engaging narratives.",
      "Multi-Platform Impact: Perfect for social media, websites, television, or presentations.",
      "Professional Edge: Stand out with polished and creative production that highlights your services effectively.",
    ],
    gallery: [
      { src: adFilm01, alt: "Ad film production still 1" },
      { src: adFilm02, alt: "Ad film production still 2" },
      { src: adFilm03, alt: "Ad film production still 3" },
      { src: adFilm04, alt: "Ad film production still 4" },
      { src: adFilm05, alt: "Ad film production still 5" },
      { src: adFilm06, alt: "Ad film production still 6" },
    ],
  },
];

/** Marquee copy below the gradient strip (unchanged from the original). */
const marqueeSecondaryServices = ["SEO", "Influencer Marketing", "Strategy"];

const serviceByPath = services.reduce((acc, service) => {
  acc[service.path] = service;
  service.aliases.forEach((alias) => {
    acc[alias] = service;
  });
  return acc;
}, {});

const getServiceByPath = (path) => serviceByPath[path];

export { marqueeSecondaryServices, getServiceByPath };
export default services;
