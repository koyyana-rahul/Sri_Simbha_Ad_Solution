import { FaWhatsapp } from "react-icons/fa";

import siteConfig, { buildWhatsAppUrl } from "../../../config/site.config";

/**
 * Floating WhatsApp call-to-action.
 *
 * The number and pre-filled message come from `config/site.config.js`
 * (overridable through `REACT_APP_WHATSAPP_NUMBER`), the label is exposed to
 * assistive technology, and the link opens safely in a new tab. Positioning
 * uses `env(safe-area-inset-*)` so the button clears notches and home
 * indicators on phones instead of hugging the screen edge.
 */
const WhatsAppButton = ({
  message = siteConfig.contact.whatsappMessage,
  label = `Chat with ${siteConfig.shortName} on WhatsApp`,
  className = "",
}) => (
  <a
    href={buildWhatsAppUrl(message)}
    target="_blank"
    rel="noopener noreferrer"
    className={`group fixed z-floating ${className}`.trim()}
    style={{
      bottom: "max(1.25rem, env(safe-area-inset-bottom))",
      right: "max(1.25rem, env(safe-area-inset-right))",
    }}
    aria-label={label}
  >
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-neutral-800 px-3 py-1 text-xs text-white opacity-0 shadow-md transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:text-sm dark:bg-white dark:text-black"
    >
      Chat with us
    </span>

    <span className="block rounded-full bg-green-500 p-3 text-white shadow-xl transition duration-300 hover:scale-105 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 sm:p-4">
      <FaWhatsapp className="text-2xl sm:text-3xl" aria-hidden="true" />
    </span>
  </a>
);

export default WhatsAppButton;
