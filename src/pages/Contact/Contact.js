import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

import Breadcrumbs from "../../components/common/Breadcrumbs/Breadcrumbs";
import DecorativeBlobs from "../../components/common/DecorativeBlobs/DecorativeBlobs";
import Seo from "../../components/common/Seo/Seo";
import StructuredData from "../../components/common/StructuredData/StructuredData";
import {
  fadeUpLarge,
  inViewOnce,
} from "../../components/common/motion/motionVariants";
import { buildLocalBusinessSchema } from "../../utils/structuredData";
import { serviceAreas } from "../../data/company.data";
import EnquiryForm from "../../features/contact/components/EnquiryForm";
import {
  contactChannels,
  contactPage,
} from "../../features/contact/data/contact.data";

/**
 * Contact route screen.
 *
 * Three channels are presented as accessible cards, followed by an enquiry form
 * that composes the message into a pre-filled WhatsApp or e-mail. There is no
 * backend, so the form deliberately posts nowhere — see `EnquiryForm` for why
 * that is a real destination rather than a stub.
 */
const Contact = () => (
  <section className="relative flex min-h-viewport flex-col items-center overflow-hidden bg-white px-4 pb-10 pt-20 text-gray-900 dark:bg-surface-dark dark:text-gray-100 sm:px-6">
    <Seo
      title={contactPage.metaTitle}
      description={contactPage.intro}
      path="/contact"
    />
    <StructuredData data={buildLocalBusinessSchema()} />

    <DecorativeBlobs />

    <div className="relative z-10 w-full max-w-container">
      <Breadcrumbs items={contactPage.breadcrumbs} className="mb-8" />
    </div>

    <motion.div
      className="relative z-10 max-w-4xl text-center"
      initial="hidden"
      whileInView="visible"
      viewport={inViewOnce}
      variants={fadeUpLarge}
      custom={0}
    >
      <h1 className="mb-6 text-h1 font-bold text-brand-600 dark:text-brand-400">
        {contactPage.title}
      </h1>
      <p className="measure mx-auto text-lead font-light text-gray-700 dark:text-gray-300">
        {contactPage.intro}
      </p>
    </motion.div>

    <motion.ul
      className="relative z-10 mt-12 grid w-full max-w-container grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-3"
      initial="hidden"
      whileInView="visible"
      viewport={inViewOnce}
      variants={fadeUpLarge}
      custom={2}
    >
      {contactChannels.map((channel, index) => {
        const Icon = channel.icon;

        return (
          <motion.li key={channel.id} variants={fadeUpLarge} custom={index + 2}>
            <a
              href={channel.href}
              {...(channel.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="block cursor-pointer rounded-xl border border-gray-200 bg-white/50 p-6 text-center shadow-md backdrop-blur-md transition-all duration-300 hover:shadow-brand-300/30 sm:p-8 dark:border-gray-700 dark:bg-gray-800"
              whileHover={{ scale: 1.05 }}
            >
              <span className="mb-5 flex justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-orange-500 shadow-lg ring-2 ring-brand-100 sm:h-16 sm:w-16 dark:ring-brand-900">
                  <Icon
                    className="h-6 w-6 text-white sm:h-7 sm:w-7"
                    aria-hidden="true"
                  />
                </span>
              </span>
              <h2 className="text-h3 font-semibold text-brand-600 dark:text-brand-400">
                {channel.label}
              </h2>
              <p className="mt-2 break-words text-sm font-light text-gray-700 dark:text-gray-300 sm:text-base md:text-lg">
                {channel.value}
              </p>
            </a>
          </motion.li>
        );
      })}
    </motion.ul>

    <motion.div
      className="relative z-10 mt-16 w-full max-w-3xl px-4 sm:px-6"
      initial="hidden"
      whileInView="visible"
      viewport={inViewOnce}
      variants={fadeUpLarge}
    >
      <EnquiryForm />
    </motion.div>

    <motion.div
      className="relative z-10 mt-14 w-full max-w-3xl px-4 text-center sm:px-6"
      initial="hidden"
      whileInView="visible"
      viewport={inViewOnce}
      variants={fadeUpLarge}
    >
      <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
        Areas we cover
      </h2>
      <ul className="flex flex-wrap justify-center gap-2">
        {serviceAreas.map((area) => (
          <li key={area}>
            <span className="inline-flex items-center gap-1.5 rounded-pill bg-brand-50 px-3.5 py-1.5 text-sm font-medium text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
              <MapPin size={13} aria-hidden="true" />
              {area}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  </section>
);

export default Contact;
