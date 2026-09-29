import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import EnquiryForm from "./EnquiryForm";
import services from "../../../config/services.config";

const fill = async (user, overrides = {}) => {
  const values = {
    name: "Ramesh Kumar",
    phone: "9876543210",
    email: "ramesh@example.com",
    service: services[0].path,
    message: "New bakery in Gajuwaka, want a screen and 500 tea cups.",
    ...overrides,
  };

  await user.type(screen.getByLabelText(/your name/i), values.name);
  await user.type(screen.getByLabelText(/phone/i), values.phone);
  await user.type(screen.getByLabelText(/e-?mail/i), values.email);
  await user.selectOptions(
    screen.getByLabelText(/service you need/i),
    values.service
  );
  await user.type(
    screen.getByLabelText(/what would you like to promote/i),
    values.message
  );

  return values;
};

const renderForm = () => render(<EnquiryForm />);

describe("EnquiryForm", () => {
  it("labels every control", () => {
    renderForm();

    expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-?mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/service you need/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/what would you like to promote/i)
    ).toBeInTheDocument();
  });

  it("offers every registered service plus a not-sure option", () => {
    renderForm();

    const select = screen.getByLabelText(/service you need/i);
    services.forEach((service) => {
      expect(
        within(select).getByRole("option", { name: service.title })
      ).toBeInTheDocument();
    });
    expect(
      within(select).getByRole("option", { name: /not sure yet/i })
    ).toBeInTheDocument();
  });

  it("reports every empty required field on submit", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: /check details/i }));

    const alerts = await screen.findAllByRole("alert");
    expect(alerts.length).toBe(5);
    expect(screen.getByText(/a phone number is required/i)).toBeInTheDocument();
    expect(
      screen.getByText(/an e-mail address is required/i)
    ).toBeInTheDocument();
  });

  it("marks invalid fields with aria-invalid", async () => {
    const user = userEvent.setup();
    renderForm();

    const name = screen.getByLabelText(/your name/i);
    expect(name).toHaveAttribute("aria-invalid", "false");

    await user.click(screen.getByRole("button", { name: /check details/i }));

    await waitFor(() => expect(name).toHaveAttribute("aria-invalid", "true"));
  });

  it("rejects an e-mail address that is not one", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(/e-?mail/i), "not-an-email");
    await user.click(screen.getByRole("button", { name: /check details/i }));

    expect(
      await screen.findByText(/e-mail address does not look right/i)
    ).toBeInTheDocument();
  });

  it("clears the error once the value becomes valid", async () => {
    const user = userEvent.setup();
    renderForm();

    const email = screen.getByLabelText(/e-?mail/i);
    await user.type(email, "bad");
    await user.tab();

    expect(
      await screen.findByText(/e-mail address does not look right/i)
    ).toBeInTheDocument();

    await user.clear(email);
    await user.type(email, "ramesh@example.com");
    await user.tab();

    await waitFor(() =>
      expect(
        screen.queryByText(/e-mail address does not look right/i)
      ).toBeNull()
    );
  });

  it("accepts a complete submission", async () => {
    const user = userEvent.setup();
    renderForm();

    await fill(user);
    await user.click(screen.getByRole("button", { name: /check details/i }));

    await waitFor(() => expect(screen.queryAllByRole("alert")).toHaveLength(0));
  });

  it("refuses to open WhatsApp while the form is invalid", async () => {
    const user = userEvent.setup();
    const open = jest.spyOn(window, "open").mockImplementation(() => null);

    renderForm();
    await user.click(screen.getByRole("button", { name: /send on whatsapp/i }));

    expect(open).not.toHaveBeenCalled();
    expect(
      await screen.findByText(/fix the highlighted fields before sending/i)
    ).toBeInTheDocument();

    open.mockRestore();
  });

  /**
   * Regression test.
   *
   * Both send paths used to set `errors` without setting `touched`, and the
   * error renderer is gated on `touched`. The result was a form that said
   * "fix the highlighted fields" while highlighting nothing at all — the
   * visitor had no idea which field was wrong.
   */
  it("actually reveals the field errors when a send path is used", async () => {
    const user = userEvent.setup();
    const open = jest.spyOn(window, "open").mockImplementation(() => null);

    renderForm();
    await user.click(screen.getByRole("button", { name: /send on whatsapp/i }));

    const alerts = await screen.findAllByRole("alert");
    expect(alerts).toHaveLength(5);
    expect(screen.getByText(/please tell us your name/i)).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Your name" })).toHaveAttribute(
      "aria-invalid",
      "true"
    );

    open.mockRestore();
  });

  it("reveals field errors when the e-mail path is used", async () => {
    const user = userEvent.setup();

    renderForm();
    await user.click(screen.getByRole("button", { name: /send by e-?mail/i }));

    expect(await screen.findAllByRole("alert")).toHaveLength(5);
  });

  it("opens WhatsApp with the enquiry pre-filled once valid", async () => {
    const user = userEvent.setup();
    const open = jest.spyOn(window, "open").mockImplementation(() => null);

    renderForm();
    await fill(user);
    await user.click(screen.getByRole("button", { name: /send on whatsapp/i }));

    expect(open).toHaveBeenCalledTimes(1);

    const [url, target, features] = open.mock.calls[0];
    expect(url.startsWith("https://wa.me/")).toBe(true);
    expect(target).toBe("_blank");
    // `noopener` must be present or the opened tab can reach back into the app.
    expect(features).toContain("noopener");
    expect(decodeURIComponent(url)).toContain("Ramesh Kumar");

    expect(
      await screen.findByText(/WhatsApp opened with your enquiry/i)
    ).toBeInTheDocument();

    open.mockRestore();
  });

  it("pre-selects a service when one is passed in", () => {
    render(<EnquiryForm defaultService={services[2].path} />);
    expect(screen.getByLabelText(/service you need/i)).toHaveValue(
      services[2].path
    );
  });

  it("never hides the reason nothing happened by disabling the buttons", () => {
    renderForm();

    screen.getAllByRole("button").forEach((button) => {
      expect(button).toBeEnabled();
    });
  });
});
