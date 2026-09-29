import {
  buildEnquiryMessage,
  buildEnquirySubject,
  validateEmail,
  validateEnquiry,
  validateMessage,
  validateName,
  validatePhone,
  validateService,
} from "./validators";

const VALID = {
  name: "Ramesh Kumar",
  phone: "9876543210",
  email: "ramesh@example.com",
  service: "/services/led",
  message: "New bakery in Gajuwaka, want a screen and 500 tea cups.",
};

describe("field validators", () => {
  it("rejects a blank name", () => {
    expect(validateName("")).toBeTruthy();
    expect(validateName("   ")).toBeTruthy();
  });

  it("rejects a one-character name", () => {
    expect(validateName("R")).toBeTruthy();
  });

  it("accepts a normal name", () => {
    expect(validateName(VALID.name)).toBe("");
  });

  it("rejects a name longer than 80 characters", () => {
    expect(validateName("a".repeat(81))).toBeTruthy();
  });

  it("requires a phone number", () => {
    expect(validatePhone("")).toBeTruthy();
  });

  it("rejects letters inside a phone number", () => {
    expect(validatePhone("98765abcde")).toBeTruthy();
  });

  it("accepts the common ways a phone number gets typed", () => {
    // Deliberately permissive: rejecting a valid Indian mobile over formatting
    // would cost more enquiries than it prevents.
    expect(validatePhone("9876543210")).toBe("");
    expect(validatePhone("+91 98765 43210")).toBe("");
    expect(validatePhone("(040) 1234-5678")).toBe("");
  });

  it("rejects a phone number that is too short to be real", () => {
    expect(validatePhone("12345")).toBeTruthy();
  });

  it("rejects malformed e-mail addresses", () => {
    expect(validateEmail("")).toBeTruthy();
    expect(validateEmail("ramesh")).toBeTruthy();
    expect(validateEmail("ramesh@example")).toBeTruthy();
    expect(validateEmail("ramesh @example.com")).toBeTruthy();
  });

  it("accepts a normal e-mail address", () => {
    expect(validateEmail(VALID.email)).toBe("");
  });

  it("requires a service to be chosen", () => {
    expect(validateService("", [VALID.service])).toBeTruthy();
  });

  it("rejects a service that is not one of the offered options", () => {
    expect(validateService("/services/nope", [VALID.service])).toBeTruthy();
  });

  it("accepts one of the offered services", () => {
    expect(validateService(VALID.service, [VALID.service])).toBe("");
  });

  it("requires the message to have some substance", () => {
    expect(validateMessage("hi")).toBeTruthy();
    expect(validateMessage("")).toBeTruthy();
  });

  it("rejects an over-long message", () => {
    expect(validateMessage("a".repeat(1501))).toBeTruthy();
  });

  it("accepts a message that meets the minimum length", () => {
    expect(validateMessage(VALID.message)).toBe("");
  });
});

describe("validateEnquiry", () => {
  it("reports no errors for a complete submission", () => {
    expect(validateEnquiry(VALID, { services: [VALID.service] })).toEqual({});
  });

  it("reports every failing field at once, not just the first", () => {
    const errors = validateEnquiry(
      { name: "", phone: "", email: "", service: "", message: "" },
      { services: [VALID.service] }
    );

    expect(Object.keys(errors).sort()).toEqual([
      "email",
      "message",
      "name",
      "phone",
      "service",
    ]);
  });

  it("accepts the not-sure sentinel when it is offered", () => {
    const errors = validateEnquiry(
      { ...VALID, service: "not-sure" },
      { services: [VALID.service, "not-sure"] }
    );

    expect(errors).toEqual({});
  });

  it("tolerates being called with no arguments", () => {
    expect(() => validateEnquiry()).not.toThrow();
    expect(Object.keys(validateEnquiry()).length).toBeGreaterThan(0);
  });
});

describe("message composition", () => {
  it("includes every field in a stable order", () => {
    const message = buildEnquiryMessage(VALID, "LED Display Ads");

    expect(message).toContain("Name: Ramesh Kumar");
    expect(message).toContain("Phone: 9876543210");
    expect(message).toContain("E-mail: ramesh@example.com");
    expect(message).toContain("Service: LED Display Ads");
    expect(message.indexOf("Name:")).toBeLessThan(message.indexOf("Phone:"));
    expect(message.indexOf("Phone:")).toBeLessThan(message.indexOf("E-mail:"));
  });

  it("does not throw on an empty submission", () => {
    expect(() => buildEnquiryMessage()).not.toThrow();
  });

  it("builds a mail subject from the service and the name", () => {
    expect(buildEnquirySubject(VALID, "LED Display Ads")).toBe(
      "Enquiry: LED Display Ads — Ramesh Kumar"
    );
  });

  it("falls back to a generic subject when no service is chosen", () => {
    expect(buildEnquirySubject({}, "General enquiry")).toBe(
      "Enquiry: General enquiry"
    );
  });
});
