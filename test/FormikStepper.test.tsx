import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FormikStep } from "../src/fromikForm/FormikStep";
import { FormikStepper } from "../src/fromikForm/FormikStepper";

afterEach(cleanup);

const renderStepper = (
  props: Partial<React.ComponentProps<typeof FormikStepper>> = {}
) =>
  render(
    <FormikStepper initialValues={{}} onSubmit={vi.fn()} {...props}>
      <FormikStep id="account" label="Account">
        <div>Account content</div>
      </FormikStep>
      <FormikStep id="address" label="Address">
        <div>Address content</div>
      </FormikStep>
    </FormikStepper>
  );

describe("FormikStepper v3 navigation", () => {
  it("navigates by stable step id in uncontrolled mode", async () => {
    const onStepChange = vi.fn();
    renderStepper({ onStepChange });

    await userEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Address content")).toBeTruthy();
    expect(onStepChange).toHaveBeenCalledWith("address");
  });

  it("starts from an explicit stable step id", () => {
    renderStepper({ initialStepId: "address" });

    expect(screen.getByText("Address content")).toBeTruthy();
  });

  it("reports controlled navigation without changing the active step", async () => {
    const onStepChange = vi.fn();
    renderStepper({ activeStepId: "account", onStepChange });

    await userEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(onStepChange).toHaveBeenCalledWith("address");
    expect(screen.getByText("Account content")).toBeTruthy();
  });

  it("keeps controlled navigation stable when rendered steps change", () => {
    const { rerender } = render(
      <FormikStepper initialValues={{}} onSubmit={vi.fn()} activeStepId="address">
        <FormikStep id="account">Account content</FormikStep>
        <FormikStep id="address">Address content</FormikStep>
      </FormikStepper>
    );

    rerender(
      <FormikStepper initialValues={{}} onSubmit={vi.fn()} activeStepId="address">
        <FormikStep id="intro">Intro content</FormikStep>
        <FormikStep id="account">Account content</FormikStep>
        <FormikStep id="address">Address content</FormikStep>
      </FormikStepper>
    );

    expect(screen.getByText("Address content")).toBeTruthy();
    expect(screen.queryByText("Intro content")).toBeNull();
  });

  it("rejects duplicate stable step ids", () => {
    expect(() =>
      render(
        <FormikStepper initialValues={{}} onSubmit={vi.fn()}>
          <FormikStep id="duplicate">First</FormikStep>
          <FormikStep id="duplicate">Second</FormikStep>
        </FormikStepper>
      )
    ).toThrow("FormikStep ids must be unique");
  });
});
