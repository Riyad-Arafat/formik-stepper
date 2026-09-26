import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Form, Formik } from "formik";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  CheckBoxField,
  InputField,
  RadioField,
  SelectField,
} from "../src/fields";

afterEach(cleanup);

const renderInvalidFields = () =>
  render(
    <Formik
      initialValues={{ email: "", terms: false, plan: "", country: "" }}
      initialErrors={{
        email: "Email is required",
        terms: "Accept the terms",
        plan: "Choose a plan",
        country: "Choose a country",
      }}
      initialTouched={{ email: true, terms: true, plan: true, country: true }}
      onSubmit={vi.fn()}
    >
      <Form>
        <InputField
          name="email"
          label="Email"
          type="email"
          aria-describedby="email-help"
        />
        <span id="email-help">Use your work address.</span>
        <CheckBoxField name="terms" label="Terms" />
        <RadioField
          name="plan"
          label="Plan"
          options={[{ label: "Basic", value: "basic" }]}
        />
        <SelectField
          name="country"
          label="Country"
          options={[{ label: "Egypt", value: "eg" }]}
        />
      </Form>
    </Formik>,
  );

describe("built-in field accessibility", () => {
  it("operates password visibility from the keyboard", async () => {
    const user = userEvent.setup();
    render(
      <Formik initialValues={{ password: "" }} onSubmit={vi.fn()}>
        <Form>
          <InputField name="password" label="Password" type="password" />
        </Form>
      </Formik>,
    );

    await user.tab();
    expect(document.activeElement).toBe(screen.getByLabelText("Password"));
    await user.tab();
    const toggle = screen.getByRole("button", { name: "Show password" });
    expect(document.activeElement).toBe(toggle);
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: "Hide password" })).toBeTruthy();
  });

  it("connects text and checkbox errors without replacing help text", () => {
    renderInvalidFields();

    const email = screen.getByLabelText("Email");
    const terms = screen.getByRole("checkbox", { name: "Terms" });

    expect(email.getAttribute("aria-invalid")).toBe("true");
    expect(email.getAttribute("aria-describedby")).toContain("email-help");
    expect(email.getAttribute("aria-describedby")).toContain("-error");
    expect(terms.getAttribute("aria-invalid")).toBe("true");
    expect(
      document.getElementById(terms.getAttribute("aria-describedby")!)
        ?.textContent,
    ).toContain("Accept the terms");
  });

  it("connects radio-group and select errors to their controls", () => {
    renderInvalidFields();

    const radio = screen.getByRole("radio", { name: "Basic" });
    const select = screen.getByRole("combobox", { name: "Country" });

    expect(radio.getAttribute("aria-invalid")).toBe("true");
    expect(
      document.getElementById(radio.getAttribute("aria-describedby")!)
        ?.textContent,
    ).toContain("Choose a plan");
    expect(select.getAttribute("aria-invalid")).toBe("true");
    expect(
      document.getElementById(select.getAttribute("aria-errormessage")!)
        ?.textContent,
    ).toContain("Choose a country");
  });
});
