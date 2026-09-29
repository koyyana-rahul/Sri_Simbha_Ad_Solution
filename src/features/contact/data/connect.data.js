import {
  FaLightbulb,
  FaBullhorn,
  FaProjectDiagram,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";

import siteConfig from "../../../config/site.config";

/** Icon lookup for the social rows rendered by the connect section. */
export const socialIcons = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
  twitter: FaTwitter,
};

/** Hover accent per network, matching the original colour treatment. */
export const socialHoverColor = {
  facebook: "hover:text-blue-600",
  instagram: "hover:text-pink-500",
  linkedin: "hover:text-blue-800",
  youtube: "hover:text-red-600",
  twitter: "hover:text-sky-500",
};

export const socialLinks = siteConfig.social;

export const capabilities = [
  {
    id: "brand-management",
    icon: FaLightbulb,
    iconClassName: "text-brand-500",
    title: "Brand Management",
    items: [
      "Brand identity",
      "Brand strategy",
      "Rebranding",
      "Packaging design",
      "Creative design",
      "Marketing collaterals",
    ],
  },
  {
    id: "digital-marketing",
    icon: FaBullhorn,
    iconClassName: "text-red-500",
    title: "Digital Marketing",
    items: [
      "Social media management",
      "Search engine optimization",
      "Email marketing",
      "Influencer marketing",
      "Performance marketing",
      "Press release",
    ],
  },
];

export const projectPrompt = {
  icon: FaProjectDiagram,
  iconClassName: "text-indigo-500",
  title: "Have a project in mind?",
  subtitle: "Let’s Connect!",
};
