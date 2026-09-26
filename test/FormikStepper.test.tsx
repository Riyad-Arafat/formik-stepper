import React from "react";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
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
  it("supports keyboard-only forward and backward navigation", async () => {
    const user = userEvent.setup();
    renderStepper();

    await user.tab();
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Next" }),
    );
    await user.keyboard("{Enter}");
    expect(await screen.findByText("Address content")).toBeTruthy();

    await user.tab();
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Prev" }),
    );
    await user.keyboard("{Enter}");
    expect(await screen.findByText("Account content")).toBeTruthy();
  });

  it("renders the numbered indicator by default", () => {
    const { container } = renderStepper();

    expect(screen.getByRole("navigation", { name: "Form progress" })).toBeTruthy();
    expect(container.querySelector(".fs-stepper--numbered")).toBeTruthy();
    expect(
      container.querySelector("li[aria-current='step']")?.textContent,
    ).toContain("Account — Current");
    expect(container.querySelectorAll(".fs-visually-hidden")[1]?.textContent).toContain(
      "Upcoming",
    );
  });

  it("renders compact and progress indicator variants", () => {
    const { container, rerender } = renderStepper({ indicatorVariant: "compact" });

    expect(screen.getByText("Step 1 of 2")).toBeTruthy();
    expect(container.querySelector(".fs-stepper--compact")).toBeTruthy();

    rerender(
      <FormikStepper
        initialValues={{}}
        onSubmit={vi.fn()}
        indicatorVariant="progress"
      >
        <FormikStep id="account" label="Account">Account content</FormikStep>
        <FormikStep id="address" label="Address">Address content</FormikStep>
      </FormikStepper>
    );

    expect(screen.getByRole("progressbar", { name: "Form completion" })).toBeTruthy();
  });

  it("can hide the default indicator", () => {
    renderStepper({ withStepperLine: false });

    expect(screen.queryByRole("navigation", { name: "Form progress" })).toBeNull();
  });

  it("supports scoped classes and CSS-token theming on the form wrapper", () => {
    const { container } = renderStepper({
      formClassName: "checkout-theme",
      formStyle: {
        "--fs-step-current": "#713f12",
        "--fs-radius-control": "0px",
      } as React.CSSProperties,
    });
    const form = container.querySelector("form");

    expect(form?.classList.contains("fs-form")).toBe(true);
    expect(form?.classList.contains("checkout-theme")).toBe(true);
    expect(form?.style.getPropertyValue("--fs-step-current")).toBe("#713f12");
    expect(form?.style.getPropertyValue("--fs-radius-control")).toBe("0px");
  });

  it("navigates by stable step id in uncontrolled mode", async () => {
    const onStepChange = vi.fn();
    renderStepper({ onStepChange });

    await userEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Address content")).toBeTruthy();
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toBe("Step 2 of 2."),
    );
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
