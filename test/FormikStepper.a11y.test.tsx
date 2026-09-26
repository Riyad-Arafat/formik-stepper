import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FormikStep } from "../src/fromikForm/FormikStep";
import { FormikStepper } from "../src/fromikForm/FormikStepper";

afterEach(cleanup);

const expectNoAxeViolations = async (container: HTMLElement) => {
  const results = await axe.run(container, {
    rules: {
      "color-contrast": { enabled: false },
    },
  });

  expect(
    results.violations.map(({ id, nodes }) => ({
      id,
      targets: nodes.flatMap(({ target }) => target),
    })),
  ).toEqual([]);
};

describe("FormikStepper automated accessibility", () => {
  it("has no detectable violations in the default workflow", async () => {
    const { container } = render(
      <FormikStepper initialValues={{}} onSubmit={vi.fn()}>
        <FormikStep id="account" label="Account">Account details</FormikStep>
        <FormikStep id="review" label="Review">Review details</FormikStep>
      </FormikStepper>,
    );

    await expectNoAxeViolations(container);
  });

  it("has no detectable violations in the validation-error state", async () => {
    const { container } = render(
      <FormikStepper
        initialValues={{ email: "" }}
        onSubmit={vi.fn()}
        validate={() => ({ email: "Enter an email address" })}
      >
        <FormikStep id="account" label="Account">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" />
        </FormikStep>
        <FormikStep id="review" label="Review">Review details</FormikStep>
      </FormikStepper>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Next" }));
    await screen.findByRole("alert");
    await expectNoAxeViolations(container);
  });

  it("has no detectable violations after successful completion", async () => {
    const { container } = render(
      <FormikStepper initialValues={{}} onSubmit={vi.fn()}>
        <FormikStep id="review" label="Review">Review details</FormikStep>
      </FormikStepper>,
    );

    await userEvent.click(screen.getByRole("button", { name: "Submit" }));
    await screen.findByText("Completed");
    await expectNoAxeViolations(container);
  });
});
