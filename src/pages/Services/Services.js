import { motion } from "framer-motion";

import Breadcrumbs from "../../components/common/Breadcrumbs/Breadcrumbs";
import DecorativeBlobs from "../../components/common/DecorativeBlobs/DecorativeBlobs";
import Seo from "../../components/common/Seo/Seo";
import StructuredData from "../../components/common/StructuredData/StructuredData";
import Button from "../../components/common/Button/Button";
import {
  fadeUp,
  inViewOnce,
} from "../../components/common/motion/motionVariants";
import services from "../../config/services.config";
import { buildServiceListSchema } from "../../utils/structuredData";
import ServiceCard from "../../features/services/components/ServiceCard";

export const servicesBreadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
];

/**
 * Services route screen.
 *
 * The grid is data-driven from `config/services.config.js`, so the six cards
 * are one loop over one array instead of six blocks of duplicated JSX.
 */
const Services = () => (
  <div className="relative mt-16 min-h-viewport overflow-hidden bg-gray-100 px-4 py-10 text-gray-900 dark:bg-surface-dark dark:text-gray-100 sm:px-6 lg:px-10">
    <Seo
      title="Advertising Services in Visakhapatnam"
      description="LED display ads, tea cup printing, digital marketing, website building, ads on wheels and ad film production. One Visakhapatnam agency for every advertising channel."
      path="/services"
    />
    <StructuredData data={buildServiceListSchema()} />

    <DecorativeBlobs />

    <div className="relative z-10">
      <div className="mx-auto mb-10 w-full max-w-container">
        <Breadcrumbs items={servicesBreadcrumbs} />
      </div>

      <motion.div
        className="mb-12 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={inViewOnce}
        variants={fadeUp}
      >
        <h1 className="mb-4 text-h1 font-bold text-brand-600 dark:text-brand-400">
          Our Services
        </h1>
        <p className="measure-narrow mx-auto text-lead font-light text-gray-600 dark:text-gray-300">
          Explore the wide range of advertising services we provide to elevate
          your brand’s visibility.
        </p>
      </motion.div>

      <ul
        aria-label="All services"
        className="mx-auto grid max-w-container grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3"
      >
        {services.map((service, index) => (
          <li key={service.id} className="h-full">
            <ServiceCard service={service} index={index} />
          </li>
        ))}
      </ul>

      <motion.div
        className="mt-16 flex justify-center"
        initial="hidden"
        whileInView="visible"
        viewport={inViewOnce}
        variants={fadeUp}
      >
        <Button to="/contact" variant="primary" size="lg">
          Contact Us Today
        </Button>
      </motion.div>
    </div>
  </div>
);

export default Services;
