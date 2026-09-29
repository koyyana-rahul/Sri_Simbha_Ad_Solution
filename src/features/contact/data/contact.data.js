import { Mail, Phone, MapPin } from "lucide-react";

import siteConfig, { buildMailTo } from "../../../config/site.config";

/**
 * Contact channels, built from the shared site config so the phone number and
 * e-mail can never drift between this page, the footer, the connect section
 * and the floating WhatsApp button.
 *
 * `mailto:` links deliberately stay in the same tab; the map link opens in a
 * new one.
 */
export const contactChannels = [
  {
    id: "email",
    icon: Mail,
    label: "Email",
    value: siteConfig.contact.email,
    href: buildMailTo(),
    external: false,
  },
  {
    id: "whatsapp",
    icon: Phone,
    label: "WhatsApp",
    value: siteConfig.contact.phone,
    href: `https://wa.me/${siteConfig.contact.whatsappNumber}`,
    external: true,
  },
  {
    id: "location",
    icon: MapPin,
    label: "Location",
    value: siteConfig.contact.address,
    href: siteConfig.contact.mapsUrl,
    external: true,
  },
];

export const contactPage = {
  title: "Contact Us",
  metaTitle: "Contact Sri Simbha Ad Solution",
  intro:
    "Have questions, suggestions, or just want to say hello? We’re always here to help and connect. Call, message on WhatsApp, or send the enquiry form below and we will come back with a written quote — usually the same day.",
  breadcrumbs: [
    { name: "Home", path: "/" },
    { name: "Contact Us", path: "/contact" },
  ],
};
