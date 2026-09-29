import SlideShow from "../../components/animations/SlideShow/SlideShow";
import TextPathAnimation from "../../components/animations/TextPathAnimation/TextPathAnimation";
import Seo from "../../components/common/Seo/Seo";
import StructuredData from "../../components/common/StructuredData/StructuredData";
import services, {
  marqueeSecondaryServices,
} from "../../config/services.config";
import siteConfig from "../../config/site.config";
import {
  buildLocalBusinessSchema,
  buildWebSiteSchema,
} from "../../utils/structuredData";
import ConnectSection from "../../features/contact/components/ConnectSection";
import { heroSlides } from "../../features/home/data/home.data";
import CtaSection from "../../features/home/sections/CtaSection";
import FaqSection from "../../features/home/sections/FaqSection";
import HeroSection from "../../features/home/sections/HeroSection";
import HowItWorksSection from "../../features/home/sections/HowItWorksSection";
import ServicesPreviewSection from "../../features/home/sections/ServicesPreviewSection";
import StatsSection from "../../features/home/sections/StatsSection";
import TestimonialsSection from "../../features/home/sections/TestimonialsSection";
import WhySimbhaSection from "../../features/home/sections/WhySimbhaSection";

const marqueeItems = services.map((service) => service.shortTitle);

/**
 * Home route screen.
 *
 * A composition only — every section lives in its own file under
 * `features/home/sections`, and all copy/imagery lives in
 * `features/home/data`. Adding a section is a two-line change here.
 *
 * The home page previously rendered no `<Seo>` at all, so its title and
 * description came only from the static `index.html` and were never reconciled
 * on client-side navigation — a visitor who reached `/` by navigating (rather
 * than by loading it) got whatever metadata the previous route left behind.
 */
const Home = () => (
  <div className="min-h-viewport overflow-x-hidden bg-white text-black transition-colors duration-300 dark:bg-surface-dark dark:text-gray-100">
    <Seo title={null} description={siteConfig.description} path="/" />
    <StructuredData data={[buildWebSiteSchema(), buildLocalBusinessSchema()]} />

    <HeroSection />

    <div className="bg-gradient-to-b from-white via-gray-100 to-white px-6 py-12 dark:from-black dark:via-gray-900 dark:to-black">
      <SlideShow slides={heroSlides} />
    </div>

    <TextPathAnimation
      items={marqueeItems}
      secondaryItems={marqueeSecondaryServices}
    />

    <StatsSection />

    <ServicesPreviewSection />

    <WhySimbhaSection />
    <HowItWorksSection />
    <TestimonialsSection />
    <FaqSection />

    <CtaSection />

    <ConnectSection />
  </div>
);

export default Home;
