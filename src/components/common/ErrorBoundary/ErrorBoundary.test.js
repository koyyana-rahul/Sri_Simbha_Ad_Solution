import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ErrorBoundary from "./ErrorBoundary";

const Boom = () => {
  throw new Error("kaboom");
};

const Harness = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setShouldThrow(true)}>
        break the app
      </button>
      {shouldThrow ? <Boom /> : <p>all good</p>}
    </>
  );
};

describe("ErrorBoundary", () => {
  let consoleError;

  beforeEach(() => {
    // React logs caught errors; silence it so the test output stays readable.
    consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it("renders its children while nothing throws", () => {
    render(
      <ErrorBoundary>
        <p>all good</p>
      </ErrorBoundary>
    );

    expect(screen.getByText("all good")).toBeInTheDocument();
  });

  it("shows a recovery screen instead of a blank page", () => {
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );

    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /something went wrong/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reload page/i })
    ).toBeInTheDocument();
  });

  it("never leaks the error message or stack trace to the user", () => {
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );

    expect(screen.queryByText(/kaboom/)).not.toBeInTheDocument();
  });

  it("catches errors thrown deeper in the tree after interaction", async () => {
    const user = userEvent.setup();
    render(
      <ErrorBoundary>
        <Harness />
      </ErrorBoundary>
    );

    expect(screen.getByText("all good")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /break the app/i }));

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
