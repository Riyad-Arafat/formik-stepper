import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { Form, Formik, useFormikContext } from "formik";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  CheckBoxField,
  InputField,
  NumberField,
  RadioField,
  SelectField,
  SwitchField,
  TextAreaField,
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
  it("keeps floating inputs focusable without duplicating the label", async () => {
    const user = userEvent.setup();
    render(
      <Formik initialValues={{ name: "" }} onSubmit={vi.fn()}>
        <Form>
          <InputField name="name" label="Full name" floating required />
        </Form>
      </Formik>,
    );

    const input = screen.getByRole("textbox", {
      name: /Full name/,
    }) as HTMLInputElement;

    expect(input.placeholder).toBe(" ");
    expect(document.querySelectorAll("label")).toHaveLength(1);
    expect(screen.getAllByText("Full name")).toHaveLength(1);
    await user.click(input);
    expect(document.activeElement).toBe(input);
    await user.type(input, "Riyad");
    expect(input.value).toBe("Riyad");
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = renderInvalidFields();
    const results = await axe.run(container, {
      rules: { "color-contrast": { enabled: false } },
    });

    expect(
      results.violations.map(({ id, nodes }) => ({
        id,
        targets: nodes.flatMap(({ target }) => target),
      })),
    ).toEqual([]);
  });

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

  it("connects helper text and exposes required and disabled states", () => {
    render(
      <Formik initialValues={{ email: "", terms: false }} onSubmit={vi.fn()}>
        <Form>
          <InputField
            name="email"
            label="Email"
            type="email"
            helperText="We only use this for account notices."
            required
          />
          <CheckBoxField
            name="terms"
            label="Terms"
            helperText="Read the terms before accepting."
            disabled
          />
        </Form>
      </Formik>,
    );

    const email = screen.getByLabelText(/Email/) as HTMLInputElement;
    const terms = screen.getByRole("checkbox", {
      name: "Terms",
    }) as HTMLInputElement;

    expect(email.required).toBe(true);
    expect(email.getAttribute("aria-describedby")).toContain("-helper");
    expect(document.getElementById(email.getAttribute("aria-describedby")!)?.textContent)
      .toContain("We only use this for account notices.");
    expect(terms.disabled).toBe(true);
    expect(terms.getAttribute("aria-describedby")).toContain("-helper");
  });

  it("updates checkbox and numeric radio values through Formik", async () => {
    const user = userEvent.setup();

    const Values = () => {
      const { values } = useFormikContext<{ terms: boolean; plan: number }>();
      return <output>{JSON.stringify(values)}</output>;
    };

    render(
      <Formik initialValues={{ terms: false, plan: 0 }} onSubmit={vi.fn()}>
        <Form>
          <CheckBoxField name="terms" label="Terms" />
          <RadioField
            name="plan"
            label="Plan"
            options={[
              { label: "Free", value: 0 },
              { label: "Pro", value: 1 },
            ]}
          />
          <Values />
        </Form>
      </Formik>,
    );

    const terms = screen.getByRole("checkbox", {
      name: "Terms",
    }) as HTMLInputElement;
    const free = screen.getByRole("radio", {
      name: "Free",
    }) as HTMLInputElement;
    const pro = screen.getByRole("radio", {
      name: "Pro",
    }) as HTMLInputElement;

    expect(free.checked).toBe(true);
    expect(free.id).not.toBe(pro.id);
    await user.click(terms);
    await user.click(pro);
    expect(screen.getByText('{"terms":true,"plan":1}')).toBeTruthy();
  });

  it("selects and clears falsy option values", async () => {
    const user = userEvent.setup();

    const Values = () => {
      const { values } = useFormikContext<{ priority: number | null }>();
      return <output>{JSON.stringify(values)}</output>;
    };

    render(
      <Formik initialValues={{ priority: 1 }} onSubmit={vi.fn()}>
        <Form>
          <SelectField
            name="priority"
            label="Priority"
            options={[
              { label: "None", value: 0 },
              { label: "Normal", value: 1 },
            ]}
          />
          <Values />
        </Form>
      </Formik>,
    );

    await user.click(screen.getByRole("combobox", { name: "Priority" }));
    await user.click(screen.getByText("None"));
    expect(screen.getByText('{"priority":0}')).toBeTruthy();
  });

  it("stores NumberField values as numbers and preserves the configured empty value", async () => {
    const user = userEvent.setup();

    const Values = () => {
      const { values } = useFormikContext<{ quantity: number | null }>();
      return <output>{JSON.stringify(values)}</output>;
    };

    render(
      <Formik initialValues={{ quantity: null }} onSubmit={vi.fn()}>
        <Form>
          <NumberField
            name="quantity"
            label="Quantity"
            emptyValue={null}
            min={0}
            step={0.5}
          />
          <Values />
        </Form>
      </Formik>,
    );

    const quantity = screen.getByRole("spinbutton", {
      name: "Quantity",
    }) as HTMLInputElement;
    await user.type(quantity, "2.5");
    expect(screen.getByText('{"quantity":2.5}')).toBeTruthy();
    await user.clear(quantity);
    expect(screen.getByText('{"quantity":null}')).toBeTruthy();
  });

  it("supports textarea guidance, character counts, and boolean switches", async () => {
    const user = userEvent.setup();

    const Values = () => {
      const { values } = useFormikContext<{ notes: string; alerts: boolean }>();
      return <output>{JSON.stringify(values)}</output>;
    };

    const { container } = render(
      <Formik initialValues={{ notes: "", alerts: false }} onSubmit={vi.fn()}>
        <Form>
          <TextAreaField
            name="notes"
            label="Notes"
            helperText="Add delivery context."
            maxLength={20}
            showCharacterCount
          />
          <SwitchField
            name="alerts"
            label="Delivery alerts"
            helperText="Receive status changes."
          />
          <Values />
        </Form>
      </Formik>,
    );

    const notes = screen.getByRole("textbox", { name: "Notes" });
    const alerts = screen.getByRole("switch", { name: "Delivery alerts" });
    await user.type(notes, "Leave at reception");
    expect(screen.getByText("18 / 20")).toBeTruthy();
    await user.click(alerts);
    expect((alerts as HTMLInputElement).checked).toBe(true);
    expect(screen.getByText('{"notes":"Leave at reception","alerts":true}'))
      .toBeTruthy();

    const results = await axe.run(container, {
      rules: { "color-contrast": { enabled: false } },
    });
    expect(results.violations.map(({ id }) => id)).toEqual([]);
  });

  it("keeps numeric, textarea, and select floating controls operable", async () => {
    const user = userEvent.setup();
    render(
      <Formik
        initialValues={{ quantity: "", notes: "", country: null }}
        onSubmit={vi.fn()}
      >
        <Form>
          <NumberField name="quantity" label="Quantity" floating />
          <TextAreaField name="notes" label="Notes" floating />
          <SelectField
            name="country"
            label="Country"
            floating
            options={[{ label: "Egypt", value: "eg" }]}
          />
        </Form>
      </Formik>,
    );

    const quantity = screen.getByRole("spinbutton", { name: "Quantity" });
    const notes = screen.getByRole("textbox", { name: "Notes" });
    const country = screen.getByRole("combobox", { name: "Country" });

    expect((quantity as HTMLInputElement).placeholder).toBe(" ");
    expect((notes as HTMLTextAreaElement).placeholder).toBe(" ");
    await user.type(quantity, "3");
    await user.type(notes, "Delivery notes");
    await user.click(country);
    await user.click(screen.getByText("Egypt"));
    expect((quantity as HTMLInputElement).value).toBe("3");
    expect((notes as HTMLTextAreaElement).value).toBe("Delivery notes");
    expect(screen.getByText("Egypt")).toBeTruthy();
  });
});
