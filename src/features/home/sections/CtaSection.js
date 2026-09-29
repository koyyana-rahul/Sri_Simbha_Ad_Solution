import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

import Button from "../../../components/common/Button/Button";
import siteConfig, {
  buildTelUrl,
  buildWhatsAppUrl,
} from "../../../config/site.config";

/**
 * Conversion call-to-action band.
 *
 * The single highest-value element on a lead-generation site: it gives a visitor
 * who has scrolled past everything else three ways to convert — WhatsApp (the
 * channel this audience actually uses), a direct call, and the enquiry form.
 *
 * `heading`, `body` and `context` are props so the same component can close the
 * home page, a service page and the about page without duplicating markup.
 */
const CtaSection = ({
  heading = "Let’s plan your campaign",
  body = "Tell us what you want to promote and which part of the city you want to reach. We will come back with placements, sizes and a written quote — usually the same day.",
  context,
  className = "",
}) => (
  <section
    aria-labelledby="cta-heading"
    className={`bg-gradient-to-br from-brand-400 to-orange-500 px-6 section-y text-center text-gray-900 sm:px-10 ${className}`.trim()}
  >
    <div className="mx-auto max-w-3xl">
      <h2 id="cta-heading" className="mb-4 text-h2 font-bold">
        {heading}
      </h2>
      <p className="measure-narrow mx-auto mb-8 text-lead text-gray-900/85">
        {body}
      </p>

      {context ? (
        <p className="mb-6 text-sm font-medium text-gray-900/70">{context}</p>
      ) : null}

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button
          href={buildWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          variant="primary"
          size="lg"
          className="bg-gray-900 text-white shadow-lg hover:bg-gray-800"
        >
          <FaWhatsapp aria-hidden="true" />
          Chat on WhatsApp
        </Button>

        <Button href={buildTelUrl()} variant="outline" size="lg">
          <FaPhoneAlt aria-hidden="true" />
          {siteConfig.contact.phone}
        </Button>
      </div>
    </div>
  </section>
);

export default CtaSection;
