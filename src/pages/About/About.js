import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

import Breadcrumbs from "../../components/common/Breadcrumbs/Breadcrumbs";
import DecorativeBlobs from "../../components/common/DecorativeBlobs/DecorativeBlobs";
import Seo from "../../components/common/Seo/Seo";
import StructuredData from "../../components/common/StructuredData/StructuredData";
import {
  fadeUpLarge,
  inViewOnce,
  stagger,
} from "../../components/common/motion/motionVariants";
import CtaSection from "../../features/home/sections/CtaSection";
import {
  milestones,
  serviceAreas,
  values,
  whyChooseUs,
} from "../../data/company.data";
import { aboutPage } from "../../features/about/data/about.data";
import { buildLocalBusinessSchema } from "../../utils/structuredData";

const iconBubbleClass =
  "flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-orange-500 shadow-md ring-2 ring-brand-100 dark:ring-brand-900";

/** About route screen. */
const About = () => {
  const TeamIcon = aboutPage.team.icon;

  return (
    <>
      <Seo
        title={aboutPage.metaTitle}
        description={aboutPage.intro}
        path="/about"
      />
      <StructuredData data={buildLocalBusinessSchema()} />

      {/*
       * Page-scoped layout for About only.
       *
       * `pt-header` replaces a hardcoded `pt-20` (80px). The header is
       * `position: fixed` and measures 83px from 640px up, so 80px left the
       * breadcrumb sitting 3px behind the translucent header at every width
       * tested (320, 768, 1024, 1440, 2560). `pt-header` is derived from the
       * header's real geometry, so the two cannot drift apart again.
       *
       * `pb-section` supplies the bottom half of the site's existing
       * `section-y` rhythm. It is a separate utility rather than `section-y`
       * itself because that token's *top* value (56px) is smaller than the
       * header and would reintroduce the overlap.
       *
       * `min-h-viewport` is dropped: this section renders ~5,800px of content,
       * so a viewport minimum did nothing but imply a constraint never met.
       */}
      <section className="relative flex flex-col items-center overflow-hidden bg-white px-4 pt-header pb-section text-gray-900 dark:bg-surface-dark dark:text-gray-100 sm:px-6">
        <DecorativeBlobs />

        <div className="relative z-10 w-full max-w-4xl">
          <Breadcrumbs items={aboutPage.breadcrumbs} className="mb-8" />
        </div>

        <motion.div
          className="relative z-10 max-w-4xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
          variants={stagger}
        >
          <motion.h1
            className="mb-6 text-h1 font-bold text-brand-600 dark:text-brand-400"
            variants={fadeUpLarge}
          >
            {aboutPage.title}
          </motion.h1>
          <motion.p
            className="measure mx-auto text-lead font-light text-gray-700 dark:text-gray-300"
            variants={fadeUpLarge}
          >
            {aboutPage.intro}
          </motion.p>
        </motion.div>

        {/* Our story */}
        <motion.div
          className="relative z-10 mt-section w-full max-w-3xl"
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
          variants={stagger}
        >
          <h2 className="mb-6 text-center text-h2 font-semibold text-brand-600 dark:text-brand-400">
            How we got here
          </h2>
          {aboutPage.story.map((paragraph, index) => (
            <motion.p
              key={index}
              variants={fadeUpLarge}
              custom={index}
              className="measure mb-4 text-body-lg text-gray-700 dark:text-gray-300"
            >
              {paragraph}
            </motion.p>
          ))}
        </motion.div>

        {/* Vision and mission */}
        <motion.ul
          className="relative z-10 mt-section grid w-full max-w-container grid-cols-1 gap-8 md:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
          variants={stagger}
        >
          {aboutPage.principles.map((principle) => {
            const Icon = principle.icon;

            return (
              <motion.li
                key={principle.id}
                className="rounded-2xl bg-gray-100 p-8 shadow-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-brand-300/30 dark:bg-gray-800"
                variants={fadeUpLarge}
              >
                <div className="mb-5 flex justify-center">
                  <div className={iconBubbleClass}>
                    <Icon className="h-7 w-7 text-white" aria-hidden="true" />
                  </div>
                </div>
                <h2 className="text-center text-h3 font-semibold text-brand-600 dark:text-brand-400">
                  {principle.title}
                </h2>
                <p className="mt-4 text-center text-base font-light leading-relaxed text-gray-700 dark:text-gray-300">
                  {principle.body}
                </p>
              </motion.li>
            );
          })}
        </motion.ul>

        {/* Timeline */}
        <motion.div
          className="relative z-10 mt-section w-full max-w-3xl"
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
          variants={stagger}
        >
          <h2 className="mb-10 text-center text-h2 font-semibold text-brand-600 dark:text-brand-400">
            Milestones
          </h2>

          <ol className="relative border-l-2 border-brand-200 pl-6 dark:border-brand-800">
            {milestones.map((milestone, index) => (
              <motion.li
                key={milestone.id}
                className="relative mb-8 last:mb-0"
                variants={fadeUpLarge}
                custom={index}
              >
                <span
                  aria-hidden="true"
                  className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-brand-500 bg-white dark:bg-gray-900"
                />
                <p className="text-sm font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
                  {milestone.year}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                  {milestone.title}
                </h3>
                <p className="mt-1 text-body text-gray-700 dark:text-gray-300">
                  {milestone.body}
                </p>
              </motion.li>
            ))}
          </ol>
        </motion.div>

        {/* Values */}
        <motion.div
          className="relative z-10 mt-section w-full"
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
          variants={stagger}
        >
          <h2 className="mb-10 text-center text-h2 font-semibold text-brand-600 dark:text-brand-400">
            What we stand for
          </h2>

          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <motion.li
                  key={value.id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
                  variants={fadeUpLarge}
                >
                  <span
                    aria-hidden="true"
                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-300 to-orange-400 text-white dark:from-brand-400 dark:to-orange-500"
                  >
                    <Icon size={26} />
                  </span>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                    {value.body}
                  </p>
                </motion.li>
              );
            })}
          </ul>
        </motion.div>

        {/* Why choose us */}
        <motion.div
          className="relative z-10 mt-section w-full"
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
          variants={stagger}
        >
          <h2 className="mb-10 text-center text-h2 font-semibold text-brand-600 dark:text-brand-400">
            Why businesses choose us
          </h2>

          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {whyChooseUs.map((item) => {
              const Icon = item.icon;

              return (
                <motion.li
                  key={item.id}
                  className="flex gap-4 rounded-2xl bg-gray-100 p-6 dark:bg-gray-800"
                  variants={fadeUpLarge}
                >
                  <Icon
                    className="mt-1 h-6 w-6 shrink-0 text-brand-500"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                      {item.body}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </motion.div>

        {/* Team */}
        <motion.div
          className="relative z-10 mt-section max-w-3xl px-4 text-center sm:px-6"
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
          variants={stagger}
        >
          <div className="mb-5 flex justify-center">
            <div className={`${iconBubbleClass} animate-icon-float`}>
              <TeamIcon className="h-7 w-7 text-white" aria-hidden="true" />
            </div>
          </div>
          <motion.h2
            className="text-h2 font-semibold text-brand-600 dark:text-brand-400"
            variants={fadeUpLarge}
          >
            {aboutPage.team.title}
          </motion.h2>
          <motion.p
            className="measure mt-4 text-body-lg font-light text-gray-700 dark:text-gray-300"
            variants={fadeUpLarge}
          >
            {aboutPage.team.body}
          </motion.p>
        </motion.div>

        {/* Service areas */}
        <motion.div
          className="relative z-10 mt-section w-full max-w-3xl"
          initial="hidden"
          whileInView="visible"
          viewport={inViewOnce}
          variants={stagger}
        >
          <h2 className="mb-6 flex items-center justify-center gap-2 text-center text-h2 font-semibold text-brand-600 dark:text-brand-400">
            <MapPin className="h-6 w-6" aria-hidden="true" />
            Where we work
          </h2>
          <ul className="flex flex-wrap justify-center gap-2">
            {serviceAreas.map((area) => (
              <li key={area}>
                <span className="inline-block rounded-pill bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
                  {area}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            Digital marketing, websites and ad film production are delivered
            remotely across India.
          </p>
        </motion.div>
      </section>

      <CtaSection
        heading="Work with a team that answers"
        body="No sales desk, no ticket queue. Send us the screen or the building or the vehicle, and we will tell you honestly whether advertising is the right next step for you."
      />
    </>
  );
};

export default About;
