import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import Button from "../../../components/common/Button/Button";
import ServiceCard from "../../services/components/ServiceCard";
import {
  fadeUp,
  inViewOnce,
  stagger,
} from "../../../components/common/motion/motionVariants";
import services from "../../../config/services.config";

/**
 * Services preview for the home page.
 *
 * Reuses `ServiceCard` and the service registry, so a card here is byte-for-byte
 * the same component visitors land on from `/services` — there is no second
 * version of a service tile to keep in sync.
 */
const ServicesPreviewSection = () => (
  <section
    id="services"
    aria-labelledby="services-preview-heading"
    className="bg-gray-50 px-6 section-y dark:bg-gray-950"
  >
    <div className="mx-auto max-w-container">
      <motion.div
        className="mb-12 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={inViewOnce}
        variants={stagger}
      >
        <motion.p
          variants={fadeUp}
          className="mb-3 text-eyebrow text-brand-600 dark:text-brand-400"
        >
          What we do
        </motion.p>
        <motion.h2
          id="services-preview-heading"
          variants={fadeUp}
          className="mb-4 text-h2 font-bold text-gray-900 dark:text-white"
        >
          One team for every screen
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="measure-narrow mx-auto text-lead text-gray-600 dark:text-gray-300"
        >
          Outdoor, digital, print and film under a single brief. Pick the
          channels that fit your campaign, or let us recommend the mix.
        </motion.p>
      </motion.div>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <li key={service.id} className="h-full">
            <ServiceCard service={service} index={index} />
          </li>
        ))}
      </ul>

      <motion.div
        className="mt-12 flex justify-center"
        initial="hidden"
        whileInView="visible"
        viewport={inViewOnce}
        variants={fadeUp}
      >
        <Button as={Link} to="/services" variant="outline" size="lg">
          Compare all services
          <ArrowRight size={18} aria-hidden="true" />
        </Button>
      </motion.div>
    </div>
  </section>
);

export default ServicesPreviewSection;
