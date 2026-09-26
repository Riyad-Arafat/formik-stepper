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
import { afterEach, describe, expect, it, vi } from "vitest";
import { FormikStep } from "../src/fromikForm/FormikStep";
import { FormikStepper } from "../src/fromikForm/FormikStepper";
import { StepperDraftAdapter } from "../src/fromikForm/types";

afterEach(cleanup);

describe("FormikStepper v3 workflow behavior", () => {
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
    expect(summary.textContent).toContain("Enter an email address");
    expect(document.activeElement).toBe(summary);
    expect(screen.getByLabelText("Email")).toBeTruthy();
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
