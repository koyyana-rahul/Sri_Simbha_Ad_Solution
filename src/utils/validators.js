/**
 * Client-side validation for the enquiry form.
 *
 * Dependency-free and synchronous, so the rules are unit-testable in isolation
 * and the form can validate on blur without pulling in a schema library.
 *
 * Every validator returns a human-readable string describing the problem, or
 * `""` when the value is acceptable. Returning the message (rather than a
 * boolean) is what lets the form render the error directly under the field.
 */

/**
 * Deliberately permissive. The point is to catch a typo such as a missing digit
 * or a letter in the middle of a number, not to enforce a numbering plan —
 * rejecting a valid Indian mobile because it is 11 digits starting with 6 would
 * cost more enquiries than it prevents.
 */
const PHONE_PATTERN = /^[+]?[\d\s()-]{7,20}$/;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Rejects the placeholder values and pure-whitespace submissions. */
const isBlank = (value) => !value || !String(value).trim();

export const validateName = (value) => {
  if (isBlank(value)) return "Please tell us your name.";
  if (String(value).trim().length < 2) return "That name looks too short.";
  if (String(value).trim().length > 80)
    return "Please keep the name under 80 characters.";
  return "";
};

export const validatePhone = (value) => {
  if (isBlank(value))
    return "A phone number is required so we can call you back.";
  if (!PHONE_PATTERN.test(String(value).trim())) {
    return "Enter a valid phone number, digits only.";
  }
  return "";
};

export const validateEmail = (value) => {
  if (isBlank(value)) return "An e-mail address is required.";
  if (!EMAIL_PATTERN.test(String(value).trim())) {
    return "That e-mail address does not look right.";
  }
  return "";
};

export const validateService = (value, options = []) => {
  if (isBlank(value)) return "Choose the service you are interested in.";
  if (options.length && !options.includes(value)) {
    return "Please choose one of the listed services.";
  }
  return "";
};

export const validateMessage = (value, { min = 20 } = {}) => {
  if (isBlank(value)) return "Tell us briefly what you want to promote.";
  if (String(value).trim().length < min) {
    return `Please add a little more detail (at least ${min} characters).`;
  }
  if (String(value).trim().length > 1500) {
    return "Please keep the message under 1500 characters.";
  }
  return "";
};

/**
 * Validates the whole form at once and returns `{ field: message }` for the
 * fields that failed. Used on submit so nothing is missed, while the per-field
 * validators above drive inline feedback as the visitor types.
 */
export const validateEnquiry = (
  values = {},
  { services = [], minMessage = 20 } = {}
) => {
  const errors = {};

  const name = validateName(values.name);
  if (name) errors.name = name;

  const phone = validatePhone(values.phone);
  if (phone) errors.phone = phone;

  const email = validateEmail(values.email);
  if (email) errors.email = email;

  const service = validateService(values.service, services);
  if (service) errors.service = service;

  const message = validateMessage(values.message, { min: minMessage });
  if (message) errors.message = message;

  return errors;
};

/**
 * Flattens the form into a single message for WhatsApp or e-mail.
 *
 * Keeps the same field order in both, so whoever receives the enquiry reads it
 * the same way regardless of the channel it arrived on.
 */
export const buildEnquiryMessage = (
  values = {},
  serviceLabel = "Not sure yet"
) =>
  [
    `New enquiry from the ${values.name || "website"}`,
    "",
    `Name: ${values.name || "—"}`,
    `Phone: ${values.phone || "—"}`,
    `E-mail: ${values.email || "—"}`,
    `Service: ${serviceLabel}`,
    "",
    "Message:",
    values.message || "—",
  ].join("\n");

/** `mailto:` subject line. Short, because mail clients truncate long ones. */
export const buildEnquirySubject = (
  values = {},
  serviceLabel = "General enquiry"
) => `Enquiry: ${serviceLabel}${values.name ? ` — ${values.name}` : ""}`;
