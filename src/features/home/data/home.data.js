import {
  FaRocket,
  FaEye,
  FaCheck,
  FaEnvelope,
  FaClipboardCheck,
  FaTv,
} from "react-icons/fa";

import ledDisplay from "../../../assets/images/slideshow/led-display-ads.jpg";
import teaCup from "../../../assets/images/slideshow/tea-cup-printing-ads.jpg";
import digital from "../../../assets/images/slideshow/digital-marketing.jpg";
import web from "../../../assets/images/slideshow/website-building.jpg";
import wheels from "../../../assets/images/slideshow/ads-on-wheels.jpg";
import adFilm from "../../../assets/images/slideshow/making-ad-films.jpg";
import bgVideo from "../../../assets/videos/bg-video.mp4";

/** Carousel slides — the service titles come from the shared service registry. */
export const heroSlides = [
  { id: "led", src: ledDisplay, caption: "LED Display Ads" },
  { id: "tea-cup", src: teaCup, caption: "Tea Cup Printing Ads" },
  { id: "digital-marketing", src: digital, caption: "Digital Marketing" },
  { id: "website-building", src: web, caption: "Website Building" },
  { id: "ad-on-wheels", src: wheels, caption: "Ads On Wheels" },
  { id: "ad-films", src: adFilm, caption: "Making Ad Films" },
];

export const hero = {
  eyebrow: "Sri Simbha Ad Solution",
  title: "WELCOME TO SRI SIMBHA AD SOLUTION",
  headline: "We Don’t Just Show Ads.",
  subHeadline: "We Command Attention.",
  video: {
    src: bgVideo,
    /**
     * Gradient shown behind the video so there is never a flash of empty
     * background while the clip buffers, and so the hero still has a defined
     * backdrop if the video is blocked or unsupported.
     */
    fallbackClassName: "bg-gradient-to-br from-gray-900 via-gray-800 to-black",
  },
};

export const whySimbha = [
  {
    id: "visibility",
    icon: FaEye,
    title: "High Visibility",
    description:
      "Our displays are strategically placed in high-traffic public areas.",
  },
  {
    id: "impact",
    icon: FaRocket,
    title: "Instant Impact",
    description: "Deliver your message in seconds with powerful visuals.",
  },
  {
    id: "updates",
    icon: FaCheck,
    title: "Easy Updates",
    description:
      "Modify your ad content anytime through our seamless dashboard.",
  },
];

export const howItWorks = [
  {
    id: "connect",
    icon: FaEnvelope,
    title: "1. Connect with Admin",
    description: "Start by contacting us via email or phone.",
  },
  {
    id: "share",
    icon: FaClipboardCheck,
    title: "2. Share Your Content",
    description: "Provide your ad creatives in image or video format.",
  },
  {
    id: "go-live",
    icon: FaTv,
    title: "3. Go Live on Screens",
    description: "Your campaign goes live across our digital network.",
  },
];

export const testimonials = [
  {
    id: "arjun-patel",
    quote: "Our reach skyrocketed in weeks! Sri Simbha is a game-changer.",
    name: "Arjun Patel",
  },
  {
    id: "priya-singh",
    quote: "Digital screens gave us the visibility we needed. 10/10!",
    name: "Priya Singh",
  },
];
