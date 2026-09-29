import { useId, useRef, useState } from "react";
import { FaPaperPlane, FaWhatsapp } from "react-icons/fa";

import Button from "../../../components/common/Button/Button";
import services from "../../../config/services.config";
import siteConfig from "../../../config/site.config";
import { cx } from "../../../utils/helpers";
import {
  buildEnquiryMessage,
  buildEnquirySubject,
  validateEnquiry,
} from "../../../utils/validators";

const EMPTY = { name: "", phone: "", email: "", service: "", message: "" };

/** Sentinel for "the visitor does not know which service they need yet". */
const NOT_SURE = "not-sure";

/** Label + control + error, so every field is wired for assistive technology. */
const Field = ({ id, label, error, hint, children, className = "" }) => (
  <div className={cx("flex flex-col gap-1.5", className)}>
    <label
      htmlFor={id}
      className="text-sm font-semibold text-gray-800 dark:text-gray-100"
    >
      {label}
    </label>
    {children}
    {hint ? (
      <p id={`${id}-hint`} className="text-xs text-gray-500 dark:text-gray-400">
        {hint}
      </p>
    ) : null}
    {error ? (
      <p
        id={`${id}-error`}
        role="alert"
        className="text-xs font-medium text-red-600 dark:text-red-400"
      >
        {error}
      </p>
    ) : null}
  </div>
);

const controlClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 dark:border-gray-600 dark:bg-gray-800 dark:text-white";

/**
 * Enquiry form.
 *
 * There is no backend, so the form composes the enquiry into a pre-filled
 * WhatsApp message or a `mailto:` link instead of POSTing anywhere. That is a
 * deliberate choice rather than a stub: the same three channels the rest of the
 * site uses are the ones this audience actually replies on, so nothing is lost
 * and no third-party service, API key or spam endpoint is introduced.
 *
 * Performance notes (a form is easy to make slow):
 *  - validation runs on submit and on blur, never on every keystroke, so
 *    typing does not re-render the form per character
 *  - `errors` and `touched` live here, close to the fields, rather than in a
 *    global store, so no unrelated component re-renders while typing
 *  - the submit button is never disabled — a disabled button hides *why*
 *    nothing happens, so the form validates and reports instead
 *  - `noValidate` hands validation to this component so the browser's
 *    inconsistent native bubbles are not shown on top of ours
 */
const EnquiryForm = ({ defaultService = "", className = "" }) => {
  const baseId = useId();
  const [values, setValues] = useState(() => ({
    ...EMPTY,
    service: defaultService,
  }));
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState(null);

  // Every accepted value for the `service` select, including the
  // "not sure yet" sentinel. Built once and reused by every validation call so
  // the rules can never disagree with the options actually rendered.
  const serviceOptions = services.map((service) => ({
    value: service.path,
    label: service.title,
  }));
  const serviceValues = useRef([
    ...serviceOptions.map((option) => option.value),
    NOT_SURE,
  ]).current;

  const serviceLabelFor = (path) =>
    path === NOT_SURE
      ? "Not sure yet — please advise"
      : (serviceOptions.find((option) => option.value === path)?.label ??
        "General enquiry");

  const validateAll = (next) =>
    validateEnquiry(next, { services: serviceValues });

  const setField = (name, value) =>
    setValues((previous) => ({ ...previous, [name]: value }));

  /**
   * Reveals every validation message at once.
   *
   * `errors` alone is not enough: the renderer only shows a message for a field
   * that has been `touched`, which is what stops the form shouting at someone
   * who has not typed anything yet. An explicit send attempt is an intent to
   * submit, so all five fields count as touched from that moment — without
   * this, "Send on WhatsApp" on an empty form set the errors but displayed
   * nothing, so the message said "fix the highlighted fields" while no field
   * was highlighted.
   */
  const revealAll = (found) => {
    setErrors(found);
    setTouched(
      Object.keys(EMPTY).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched((previous) => ({ ...previous, [name]: true }));

    // Validate just this field on blur, using the same rules as submit.
    setErrors((previous) => {
      const found = validateAll({ ...values, [name]: value });
      const next = { ...previous };
      if (found[name]) next[name] = found[name];
      else delete next[name];
      return next;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const found = validateAll(values);
    revealAll(found);

    if (Object.keys(found).length > 0) {
      setStatus({
        type: "error",
        message: "Please fix the highlighted fields before sending.",
      });
      return;
    }

    setStatus({ type: "error", message: null });
  };

  const openWhatsApp = () => {
    const found = validateAll(values);
    if (Object.keys(found).length > 0) {
      revealAll(found);
      setStatus({
        type: "error",
        message: "Please fix the highlighted fields before sending.",
      });
      return;
    }

    const text = buildEnquiryMessage(values, serviceLabelFor(values.service));
    window.open(
      `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(
        text
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
    setStatus({
      type: "success",
      message: "WhatsApp opened with your enquiry filled in — just press send.",
    });
  };

  const openMail = () => {
    const found = validateAll(values);
    if (Object.keys(found).length > 0) {
      revealAll(found);
      setStatus({
        type: "error",
        message: "Please fix the highlighted fields before sending.",
      });
      return;
    }

    const subject = buildEnquirySubject(
      values,
      serviceLabelFor(values.service)
    );
    const body = buildEnquiryMessage(values, serviceLabelFor(values.service));

    window.location.href = `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    setStatus({
      type: "success",
      message: "Your e-mail app opened with the enquiry filled in.",
    });
  };

  const errorFor = (name) => (touched[name] ? errors[name] : undefined);

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-labelledby={`${baseId}-heading`}
      className={cx(
        "rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-700 dark:bg-gray-800",
        className
      )}
    >
      <h2
        id={`${baseId}-heading`}
        className="mb-1 text-h3 font-bold text-gray-900 dark:text-white"
      >
        Request a quote
      </h2>
      <p className="mb-6 text-body text-gray-600 dark:text-gray-300">
        Fill this in and choose how you would like to send it. Nothing is stored
        or sent anywhere until you press one of the buttons.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id={`${baseId}-name`} label="Your name" error={errorFor("name")}>
          <input
            id={`${baseId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(event) => setField("name", event.target.value)}
            onBlur={handleBlur}
            aria-invalid={Boolean(errorFor("name"))}
            aria-describedby={
              errorFor("name") ? `${baseId}-name-error` : undefined
            }
            className={controlClass}
            placeholder="e.g. Ramesh Kumar"
          />
        </Field>

        <Field
          id={`${baseId}-phone`}
          label="Phone"
          error={errorFor("phone")}
          hint="Digits only, with the country code if you prefer."
        >
          <input
            id={`${baseId}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(event) => setField("phone", event.target.value)}
            onBlur={handleBlur}
            aria-invalid={Boolean(errorFor("phone"))}
            aria-describedby={
              errorFor("phone")
                ? `${baseId}-phone-error`
                : `${baseId}-phone-hint`
            }
            className={controlClass}
            placeholder="98765 43210"
          />
        </Field>

        <Field
          id={`${baseId}-email`}
          label="E-mail"
          error={errorFor("email")}
          className="sm:col-span-2"
        >
          <input
            id={`${baseId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(event) => setField("email", event.target.value)}
            onBlur={handleBlur}
            aria-invalid={Boolean(errorFor("email"))}
            aria-describedby={
              errorFor("email") ? `${baseId}-email-error` : undefined
            }
            className={controlClass}
            placeholder="you@business.com"
          />
        </Field>

        <Field
          id={`${baseId}-service`}
          label="Service you need"
          error={errorFor("service")}
          className="sm:col-span-2"
        >
          <select
            id={`${baseId}-service`}
            name="service"
            value={values.service}
            onChange={(event) => setField("service", event.target.value)}
            onBlur={handleBlur}
            aria-invalid={Boolean(errorFor("service"))}
            aria-describedby={
              errorFor("service") ? `${baseId}-service-error` : undefined
            }
            className={controlClass}
          >
            <option value="">Choose a service…</option>
            {serviceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
            <option value={NOT_SURE}>Not sure yet — please advise</option>
          </select>
        </Field>

        <Field
          id={`${baseId}-message`}
          label="What would you like to promote?"
          error={errorFor("message")}
          hint="Where you want to advertise and roughly when helps us quote accurately."
          className="sm:col-span-2"
        >
          <textarea
            id={`${baseId}-message`}
            name="message"
            rows={4}
            value={values.message}
            onChange={(event) => setField("message", event.target.value)}
            onBlur={handleBlur}
            aria-invalid={Boolean(errorFor("message"))}
            aria-describedby={
              errorFor("message")
                ? `${baseId}-message-error`
                : `${baseId}-message-hint`
            }
            className={cx(controlClass, "resize-y")}
            placeholder="e.g. New bakery opening in Gajuwaka, want a screen outside the market plus 500 tea cups."
          />
        </Field>
      </div>

      {status?.message ? (
        <p
          role="status"
          aria-live="polite"
          className={cx(
            "mt-4 rounded-lg p-3 text-sm font-medium",
            status.type === "error"
              ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
              : "bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300"
          )}
        >
          {status.message}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button
          type="button"
          onClick={openWhatsApp}
          variant="primary"
          size="md"
        >
          <FaWhatsapp aria-hidden="true" />
          Send on WhatsApp
        </Button>

        <Button type="button" onClick={openMail} variant="outline" size="md">
          <FaPaperPlane aria-hidden="true" />
          Send by e-mail
        </Button>

        <Button type="submit" variant="ghost" size="md">
          Check details
        </Button>
      </div>
    </form>
  );
};

export default EnquiryForm;
