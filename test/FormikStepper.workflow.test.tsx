import React from "react";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Field } from "formik";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FormikStep } from "../src/fromikForm/FormikStep";
import { FormikStepper } from "../src/fromikForm/FormikStepper";
import { StepperDraftAdapter } from "../src/fromikForm/types";

afterEach(cleanup);

describe("FormikStepper v3 workflow behavior", () => {
  it("shows completion only after submission resolves", async () => {
    let finishSubmission: () => void = () => undefined;
    const onSubmit = vi.fn(
      () => new Promise<void>((resolve) => (finishSubmission = resolve)),
    );

    const { container } = render(
      <FormikStepper initialValues={{}} onSubmit={onSubmit}>
        <FormikStep id="first" label="First">First step</FormikStep>
        <FormikStep id="review" label="Review">Review step</FormikStep>
      </FormikStepper>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getByRole("status").textContent).toContain("Working");
    expect(screen.queryByText("Completed")).toBeNull();

    await act(async () => finishSubmission());

    expect((await screen.findByRole("status")).textContent).toContain(
      "submitted successfully",
    );
    expect(container.querySelectorAll(".complete-step")).toHaveLength(2);
  });

  it("keeps the final step available when submission fails", async () => {
    const onSubmit = vi
      .fn()
      .mockRejectedValueOnce(new Error("Submission unavailable"))
      .mockResolvedValueOnce(undefined);

    render(
      <FormikStepper initialValues={{}} onSubmit={onSubmit}>
        <FormikStep id="review">Review step</FormikStep>
      </FormikStepper>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect((await screen.findByRole("alert")).textContent).toContain(
      "Submission unavailable",
    );
    expect(screen.getByText("Review step")).toBeTruthy();

    await userEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect((await screen.findByRole("status")).textContent).toContain(
      "submitted successfully",
    );
  });

  it("renders a safe empty state when no steps are available", () => {
    render(
      <FormikStepper initialValues={{}} onSubmit={vi.fn()}>
        {null}
      </FormikStepper>,
    );

    expect(screen.getByRole("status").textContent).toContain(
      "No steps are available",
    );
  });

  it("preserves values and retries a failed async guard", async () => {
    const beforeNext = vi
      .fn()
      .mockRejectedValueOnce(new Error("Connection unavailable"))
      .mockResolvedValueOnce(true);

    render(
      <FormikStepper initialValues={{ name: "" }} onSubmit={vi.fn()} beforeNext={beforeNext}>
        <FormikStep id="first">
          <label htmlFor="name">Name</label>
          <Field id="name" name="name" />
        </FormikStep>
        <FormikStep id="second">Second step</FormikStep>
      </FormikStepper>
    );

    const name = screen.getByLabelText("Name");
    await userEvent.type(name, "Riyad");
    await userEvent.click(screen.getByRole("button", { name: "Next" }));

    const alert = await screen.findByRole("alert");
    expect(alert.textContent).toContain(
      "Connection unavailable",
    );
    expect(document.activeElement).toBe(alert);
    expect(document.querySelector(".fs-transition-error")).toBeTruthy();
    expect((name as HTMLInputElement).value).toBe("Riyad");

    await userEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(await screen.findByText("Second step")).toBeTruthy();
    expect(beforeNext).toHaveBeenCalledTimes(2);
  });

  it("restores focus to the triggering action after dismissing a transition failure", async () => {
    render(
      <FormikStepper
        initialValues={{}}
        onSubmit={vi.fn()}
        beforeNext={() => Promise.reject(new Error("Try again later"))}
      >
        <FormikStep id="first">First step</FormikStep>
        <FormikStep id="second">Second step</FormikStep>
      </FormikStepper>,
    );

    const next = screen.getByRole("button", { name: "Next" });
    await userEvent.click(next);
    const alert = await screen.findByRole("alert");

    expect(document.activeElement).toBe(alert);
    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(document.activeElement).toBe(next);
  });

  it("uses the active step schema instead of the top-level validator", async () => {
    const validate = vi.fn(() => ({ future: "Future step error" }));
    const validationSchema = {
      validate: vi.fn().mockRejectedValue({
        name: "ValidationError",
        inner: [{ path: "email", message: "Email is required" }],
      }),
    };

    render(
      <FormikStepper initialValues={{ email: "" }} onSubmit={vi.fn()} validate={validate}>
        <FormikStep id="account" validationSchema={validationSchema}>
          <input name="email" aria-label="Email" />
        </FormikStep>
        <FormikStep id="future">Future step</FormikStep>
      </FormikStepper>
    );

    await userEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(validationSchema.validate).toHaveBeenCalledTimes(1);
    expect(validate).not.toHaveBeenCalled();
    expect((await screen.findByRole("alert")).textContent).toContain(
      "Email is required",
    );
  });

  it("suppresses duplicate transitions while an async guard is pending", async () => {
    let allowTransition: (allowed: boolean) => void = () => undefined;
    const beforeNext = vi.fn(
      () => new Promise<boolean>((resolve) => (allowTransition = resolve))
    );

    render(
      <FormikStepper initialValues={{}} onSubmit={vi.fn()} beforeNext={beforeNext}>
        <FormikStep id="first">First step</FormikStep>
        <FormikStep id="second">Second step</FormikStep>
      </FormikStepper>
    );

    const next = screen.getByRole("button", { name: "Next" });
    fireEvent.click(next);
    fireEvent.click(next);

    await waitFor(() => expect(beforeNext).toHaveBeenCalledTimes(1));
    expect(screen.getByRole("status").textContent).toContain("Working");
    expect(next.getAttribute("aria-busy")).toBe("true");
    await act(async () => allowTransition(true));
    expect(await screen.findByText("Second step")).toBeTruthy();
  });

  it("branches to a stable step selected from Formik values", async () => {
    render(
      <FormikStepper
        initialValues={{ skipAddress: true }}
        onSubmit={vi.fn()}
        nextStepId={(values) => (values.skipAddress ? "review" : undefined)}
      >
        <FormikStep id="account">Account step</FormikStep>
        <FormikStep id="address">Address step</FormikStep>
        <FormikStep id="review">Review step</FormikStep>
      </FormikStepper>
    );

    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Review step")).toBeTruthy();
  });

  it("focuses an active-step error summary after failed validation", async () => {
    render(
      <FormikStepper
        initialValues={{ email: "" }}
        onSubmit={vi.fn()}
        validate={() => ({ email: "Enter an email address" })}
      >
        <FormikStep id="account">
          <input name="email" aria-label="Email" />
        </FormikStep>
        <FormikStep id="done">Done</FormikStep>
      </FormikStepper>
    );

    await userEvent.click(screen.getByRole("button", { name: "Next" }));

    const summary = await screen.findByRole("alert");
    expect(summary.classList.contains("fs-error-summary")).toBe(true);
    expect(screen.getByRole("status").textContent).toContain(
      "1 validation error on step 1 of 2",
    );
    expect(summary.textContent).toContain("Enter an email address");
    expect(document.activeElement).toBe(summary);
    expect(screen.getByLabelText("Email")).toBeTruthy();

    await userEvent.click(
      screen.getByRole("link", { name: "Enter an email address" }),
    );
    expect(document.activeElement).toBe(screen.getByLabelText("Email"));
  });

  it("restores a valid draft and saves subsequent state", async () => {
    const adapter: StepperDraftAdapter = {
      load: vi.fn(() => ({ activeStepId: "second", values: { name: "Riyad" } })),
      save: vi.fn(),
    };

    render(
      <FormikStepper initialValues={{ name: "" }} onSubmit={vi.fn()} draftAdapter={adapter}>
        <FormikStep id="first">First step</FormikStep>
        <FormikStep id="second">Second step</FormikStep>
      </FormikStepper>
    );

    expect(screen.getByText("Second step")).toBeTruthy();
    await waitFor(() =>
      expect(adapter.save).toHaveBeenCalledWith({
        activeStepId: "second",
        values: { name: "Riyad" },
      })
    );
  });

  it("falls back to the first step for a stale draft step id", () => {
    const adapter: StepperDraftAdapter = {
      load: () => ({ activeStepId: "removed", values: {} }),
      save: vi.fn(),
    };

    render(
      <FormikStepper initialValues={{}} onSubmit={vi.fn()} draftAdapter={adapter}>
        <FormikStep id="first">First step</FormikStep>
        <FormikStep id="second">Second step</FormikStep>
      </FormikStepper>
    );

    expect(screen.getByText("First step")).toBeTruthy();
  });
});
