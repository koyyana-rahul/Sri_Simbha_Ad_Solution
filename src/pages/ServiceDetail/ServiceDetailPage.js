import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import Breadcrumbs from "../../components/common/Breadcrumbs/Breadcrumbs";
import DecorativeBlobs from "../../components/common/DecorativeBlobs/DecorativeBlobs";
import { ImageModal } from "../../components/common/Modal/Modal";
import Seo from "../../components/common/Seo/Seo";
import StructuredData from "../../components/common/StructuredData/StructuredData";
import {
  fadeUp,
  inViewOnce,
} from "../../components/common/motion/motionVariants";
import { getServiceByPath } from "../../config/services.config";
import { buildServiceSchema } from "../../utils/structuredData";
import CtaSection from "../../features/home/sections/CtaSection";
import BenefitsGrid from "../../features/service-detail/components/BenefitsGrid";
import RelatedServices from "../../features/service-detail/components/RelatedServices";
import ServiceGallery from "../../features/service-detail/components/ServiceGallery";
import NotFound from "../NotFound/NotFound";

/**
 * Renders any service detail screen.
 *
 * This single component replaces the six near-identical `Led.js`,
 * `TeaCup.js`, `DigitalMarketing.js`, `WebsiteBuilding.js`, `AdOnWheels.js`
 * and `AdFilms.js` files. All content and imagery come from
 * `config/services.config.js`, and the route is a single dynamic
 * `/services/:slug` entry, so adding a service no longer means writing a new
 * page component.
 */
const ServiceDetailPage = () => {
  const { slug } = useParams();
  const service = getServiceByPath(`/services/${slug}`);

  const [selectedImage, setSelectedImage] = useState(null);

  const closeLightbox = useCallback(() => setSelectedImage(null), []);

  if (!service) return <NotFound />;

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.title, path: service.path },
  ];

  return (
    <>
      <Seo
        title={service.title}
        description={service.longDescription}
        path={service.path}
        type="article"
      />
      <StructuredData data={buildServiceSchema(service)} />

      <div className="relative z-0 overflow-x-hidden bg-white pt-4 text-gray-900 dark:bg-surface-dark dark:text-gray-100">
        <DecorativeBlobs />

        <div className="relative z-10 flex flex-col items-center px-4 pb-10 pt-24 sm:px-6">
          <div className="mb-8 w-full max-w-container">
            <Breadcrumbs items={breadcrumbs} />
          </div>

          <motion.div
            className="w-full max-w-4xl text-center"
            initial="hidden"
            whileInView="visible"
            viewport={inViewOnce}
            variants={fadeUp}
          >
            <h1 className="mb-6 text-h1 font-bold text-brand-600 dark:text-brand-400">
              {service.heading}
            </h1>
            <p className="measure mx-auto mb-8 px-2 font-light text-body-lg text-gray-700 dark:text-gray-300 sm:px-0">
              {service.longDescription}
            </p>
          </motion.div>

          <BenefitsGrid benefits={service.benefits} />

          <ServiceGallery items={service.gallery} onSelect={setSelectedImage} />

          <RelatedServices currentId={service.id} />
        </div>
      </div>

      <CtaSection
        heading={`Get a quote for ${service.title.toLowerCase()}`}
        body="Tell us the area you want to cover and roughly when the campaign should start. We will come back with specific placements and a written price."
      />

      <ImageModal
        isOpen={Boolean(selectedImage)}
        onClose={closeLightbox}
        src={selectedImage?.src}
        alt={selectedImage?.alt}
        title={service.title}
      />
    </>
  );
};

export default ServiceDetailPage;
