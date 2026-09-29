import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

import StructuredData from "../../../components/common/StructuredData/StructuredData";
import { buildFaqSchema } from "../../../utils/structuredData";
import { faqs } from "../../../data/faq.data";
import { cx } from "../../../utils/helpers";

/**
 * FAQ accordion.
 *
 * Implemented with `<h3><button aria-expanded aria-controls>` rather than
 * `<details>`, because the panel has to animate and because controlling the
 * open state is what lets the button label describe the *action* ("Close
 * question") instead of the state.
 *
 * Only one panel is open at a time — a column of six expanded answers reads as
 * a wall of text and hides the rest of the page.
 *
 * The `FAQPage` schema is emitted from the same array that renders the visible
 * questions and answers. Google rejects FAQ rich results when the structured
 * data is not visible on the page, so the two must never be authored separately.
 */
const FaqSection = () => {
  const [openId, setOpenId] = useState(faqs[0]?.id ?? null);
  const baseId = useId();

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="bg-white px-6 section-y dark:bg-surface-dark"
    >
      <StructuredData data={buildFaqSchema(faqs)} />

      <div className="mx-auto max-w-3xl">
        <h2
          id="faq-heading"
          className="mb-4 text-center text-h2 font-bold text-gray-900 dark:text-white"
        >
          Frequently asked questions
        </h2>
        <p className="measure-narrow mx-auto mb-10 text-center text-body text-gray-600 dark:text-gray-300">
          Everything clients ask before their first campaign. If something is
          missing, message us and we will answer it straight.
        </p>

        <ul className="space-y-3">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            const panelId = `${baseId}-${faq.id}-panel`;
            const buttonId = `${baseId}-${faq.id}-button`;

            return (
              <li
                key={faq.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-gray-900 transition-colors hover:bg-gray-100 sm:text-lg dark:text-white dark:hover:bg-gray-800"
                  >
                    {faq.question}
                    <Plus
                      size={20}
                      aria-hidden="true"
                      className={cx(
                        "shrink-0 transition-transform duration-300",
                        isOpen && "rotate-45"
                      )}
                    />
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      key="panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-body px-5 pb-5 text-gray-700 dark:text-gray-300">
                        {faq.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default FaqSection;
