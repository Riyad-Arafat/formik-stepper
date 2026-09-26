import React, { useEffect, useMemo, useRef, useState } from "react";
import type { FormikErrors, FormikValues } from "formik";
import {
  CheckBoxField,
  InputField,
  NumberField,
  RadioField,
  SelectField,
  SwitchField,
  TextAreaField,
} from "../../src/fields/index.ts";
import { FormikStep } from "../../src/fromikForm/FormikStep.tsx";
import { FormikStepper } from "../../src/fromikForm/FormikStepper.tsx";
import type { StepIndicatorVariant } from "../../src/fromikForm/types.ts";

type ThemeId = "ink" | "harbor" | "plum";
type FieldLayout = "stacked" | "floating";
type StepSurface = "plain" | "outlined" | "tinted";

interface ThemePreset {
  name: string;
  accent: string;
  tint: string;
}

const themes: Record<ThemeId, ThemePreset> = {
  ink: { name: "Blueprint ink", accent: "#3155d9", tint: "#f2f5ff" },
  harbor: { name: "Harbor", accent: "#006d77", tint: "#edf9f8" },
  plum: { name: "Editorial plum", accent: "#704264", tint: "#faf2f8" },
};

const roleOptions = [
  { label: "Engineering", value: "engineering" },
  { label: "Design", value: "design" },
  { label: "Operations", value: "operations" },
];

const toolOptions = [
  { label: "Issue tracking", value: "issues" },
  { label: "Documentation", value: "docs" },
  { label: "Analytics", value: "analytics" },
];

const initialValues = {
  fullName: "",
  email: "",
  password: "",
  seats: "",
  role: null,
  tools: [],
  plan: "",
  notes: "",
  updates: false,
  terms: false,
};

const validateExample = (values: FormikValues) => {
  const errors: FormikErrors<FormikValues> = {};
  if (!String(values.fullName ?? "").trim()) errors.fullName = "Enter your full name.";
  if (!String(values.email ?? "").includes("@")) errors.email = "Enter a valid email address.";
  if (String(values.password ?? "").length < 8) errors.password = "Use at least 8 characters.";
  if (typeof values.seats !== "number" || values.seats < 1) errors.seats = "Choose at least one seat.";
  if (!values.role) errors.role = "Select your primary role.";
  if (!values.plan) errors.plan = "Choose a workspace plan.";
  if (!String(values.notes ?? "").trim()) errors.notes = "Tell us what you want to accomplish.";
  if (!values.terms) errors.terms = "Accept the terms to continue.";
  return errors;
};

const codeFor = ({ accent, controlSize, fieldLayout, radius, stepSurface, tint, validation, variant }: {
  accent: string;
  controlSize: number;
  fieldLayout: FieldLayout;
  radius: number;
  stepSurface: StepSurface;
  tint: string;
  validation: boolean;
  variant: StepIndicatorVariant;
}) => `import {
  CheckBoxField, FormikStep, FormikStepper, InputField,
  NumberField, RadioField, SelectField, SwitchField, TextAreaField,
} from "formik-stepper/default";
import "formik-stepper/styles.css";

const initialValues = ${JSON.stringify(initialValues, null, 2)};

const roleOptions = ${JSON.stringify(roleOptions, null, 2)};
const toolOptions = ${JSON.stringify(toolOptions, null, 2)};
const planOptions = [
  { label: "Starter", value: "starter" },
  { label: "Team", value: "team" },
  { label: "Scale", value: "scale" },
];

const validate = (values) => {
  const errors = {};
  if (!values.fullName?.trim()) errors.fullName = "Enter your full name.";
  if (!values.email?.includes("@")) errors.email = "Enter a valid email address.";
  if ((values.password?.length ?? 0) < 8) errors.password = "Use at least 8 characters.";
  if (typeof values.seats !== "number" || values.seats < 1) errors.seats = "Choose at least one seat.";
  if (!values.role) errors.role = "Select your primary role.";
  if (!values.plan) errors.plan = "Choose a workspace plan.";
  if (!values.notes?.trim()) errors.notes = "Tell us what you want to accomplish.";
  if (!values.terms) errors.terms = "Accept the terms to continue.";
  return errors;
};

const stepStyle = ${stepSurface === "plain" ? "{}" : `{ background: "${stepSurface === "tinted" ? tint : "#ffffff"}", padding: "24px", border: "1px solid #cbd2dd", borderRadius: "${radius + 4}px" }`};

<FormikStepper
  initialValues={initialValues}
  indicatorVariant="${variant}"
  ${validation ? "validate={validate}\n  " : ""}onSubmit={saveWorkspace}
  formClassName="my-stepper"
  formStyle={{
    "--fs-step-current": "${accent}",
    "--fs-focus-ring": "${accent}",
    "--fs-button-primary-hover": "${accent}",
    "--fs-radius-control": "${radius}px",
    "--fs-control-size": "${controlSize}px",
  }}
>
  <FormikStep id="account" label="Account" style={stepStyle}>
    <InputField name="fullName" label="Full name" required ${fieldLayout === "floating" ? "floating " : ""}/>
    <InputField name="email" label="Work email" type="email" required />
    <InputField name="password" label="Password" type="password" required />
    <NumberField name="seats" label="Team size" min={1} />
  </FormikStep>
  <FormikStep id="preferences" label="Preferences" style={stepStyle}>
    <SelectField name="role" label="Primary role" options={roleOptions} />
    <SelectField name="tools" label="Tools" options={toolOptions} isMulti />
    <RadioField name="plan" label="Plan" options={planOptions} />
    <SwitchField name="updates" label="Product updates" />
  </FormikStep>
  <FormikStep id="finish" label="Finish" style={stepStyle}>
    <TextAreaField name="notes" label="What do you want to build?" maxLength={240} showCharacterCount />
    <CheckBoxField name="terms" label="I accept the terms" required />
  </FormikStep>
</FormikStepper>`;

export const Playground = () => {
  const [variant, setVariant] = useState<StepIndicatorVariant>("numbered");
  const [themeId, setThemeId] = useState<ThemeId>("ink");
  const [accent, setAccent] = useState(themes.ink.accent);
  const [fieldLayout, setFieldLayout] = useState<FieldLayout>("stacked");
  const [stepSurface, setStepSurface] = useState<StepSurface>("outlined");
  const [radius, setRadius] = useState(8);
  const [controlSize, setControlSize] = useState(44);
  const [validation, setValidation] = useState(true);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const [restartKey, setRestartKey] = useState(0);
  const copyTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const theme = themes[themeId];
  const snippet = useMemo(
    () => codeFor({ accent, controlSize, fieldLayout, radius, stepSurface, tint: theme.tint, validation, variant }),
    [accent, controlSize, fieldLayout, radius, stepSurface, theme.tint, validation, variant],
  );

  const selectTheme = (id: ThemeId) => {
    setThemeId(id);
    setAccent(themes[id].accent);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    } finally {
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopyStatus("idle"), 1800);
    }
  };

  const stepStyle: React.CSSProperties = stepSurface === "plain" ? {} : {
    background: stepSurface === "tinted" ? theme.tint : "#ffffff",
    border: "1px solid var(--fs-color-border, #cbd2dd)",
    borderRadius: `${radius + 4}px`,
    padding: "clamp(1rem, 3vw, 1.5rem)",
  };

  return (
    <main className="workbench">
      <header className="workbench__header">
        <a className="workbench__brand" href="#preview">
          <span aria-hidden="true" className="workbench__mark">FS</span>
          <span>Formik Stepper <strong>component lab</strong></span>
        </a>
        <p>Configure the real API, test it, then copy the result.</p>
      </header>

      <div className="workbench__layout">
        <aside className="controls" aria-labelledby="controls-title">
          <div>
            <p className="controls__index">Configuration</p>
            <h1 id="controls-title">Build your stepper</h1>
            <p className="controls__intro">Every control changes both the live specimen and its generated integration code.</p>
          </div>

          <label className="control-field">
            <span>Step indicator</span>
            <select value={variant} onChange={(event) => setVariant(event.target.value as StepIndicatorVariant)}>
              <option value="numbered">Numbered rail</option>
              <option value="progress">Progress bar</option>
              <option value="compact">Compact context</option>
              <option value="vertical">Vertical rail</option>
            </select>
          </label>

          <fieldset>
            <legend>Theme</legend>
            <div className="theme-options">
              {(Object.entries(themes) as Array<[ThemeId, ThemePreset]>).map(([id, option]) => (
                <button key={id} type="button" aria-pressed={themeId === id} onClick={() => selectTheme(id)}>
                  <span className="theme-options__swatch" style={{ backgroundColor: option.accent }} aria-hidden="true" />
                  {option.name}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="color-field">
            <span>Accent color</span>
            <span><input type="color" value={accent} onChange={(event) => setAccent(event.target.value)} /><code>{accent}</code></span>
          </label>

          <fieldset>
            <legend>Field labels</legend>
            <div className="segmented">
              {(["stacked", "floating"] as const).map((layout) => (
                <button key={layout} type="button" aria-pressed={fieldLayout === layout} onClick={() => setFieldLayout(layout)}>{layout}</button>
              ))}
            </div>
          </fieldset>

          <label className="control-field">
            <span>Step surface</span>
            <select value={stepSurface} onChange={(event) => setStepSurface(event.target.value as StepSurface)}>
              <option value="plain">Plain</option>
              <option value="outlined">Outlined</option>
              <option value="tinted">Theme tint</option>
            </select>
          </label>

          <label className="range-field">
            <span><span>Corner radius</span><output>{radius}px</output></span>
            <input type="range" min="0" max="20" value={radius} onChange={(event) => setRadius(event.target.valueAsNumber)} />
          </label>

          <label className="range-field">
            <span><span>Control height</span><output>{controlSize}px</output></span>
            <input type="range" min="40" max="56" value={controlSize} onChange={(event) => setControlSize(event.target.valueAsNumber)} />
          </label>

          <label className="toggle-control">
            <input type="checkbox" checked={validation} onChange={(event) => setValidation(event.target.checked)} />
            <span>Enable validation example</span>
          </label>
        </aside>

        <section className="preview" id="preview" aria-labelledby="preview-title">
          <div className="preview__heading">
            <div>
              <p className="preview__status">Live library specimen</p>
              <h2 id="preview-title">Every field, one workflow</h2>
              <p>Try Continue with empty fields to inspect validation, focus management, and the error summary.</p>
            </div>
            <span className="preview__variant">{variant}</span>
          </div>

          <div className="preview__canvas">
            <FormikStepper
              key={`${restartKey}-${variant}-${fieldLayout}-${stepSurface}`}
              initialValues={initialValues}
              validate={validation ? validateExample : undefined}
              indicatorVariant={variant}
              formClassName="specimen-form"
              formStyle={{
                "--fs-step-current": accent,
                "--fs-focus-ring": accent,
                "--fs-button-primary-hover": accent,
                "--fs-radius-control": `${radius}px`,
                "--fs-control-size": `${controlSize}px`,
              } as React.CSSProperties}
              onSubmit={async () => new Promise((resolve) => window.setTimeout(resolve, 450))}
              renderCompletion={() => (
                <div className="specimen-completion" role="status">
                  <span className="specimen-completion__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22">
                      <path d="m5 12.5 4.25 4.25L19 7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" />
                    </svg>
                  </span>
                  <h3>Workspace configured</h3>
                  <p>The completion renderer can lead into the next product action.</p>
                  <button type="button" className="formik-s-btn formik-s-btn--secondary" onClick={() => setRestartKey((key) => key + 1)}>Restart example</button>
                </div>
              )}
            >
              <FormikStep id="account" label="Account" style={stepStyle}>
                <div className="specimen-step">
                  <h3>Account details</h3>
                  <p>Text, email, password, floating labels, and numeric values.</p>
                  <InputField name="fullName" label="Full name" helperText="Use the name your team will recognize." required floating={fieldLayout === "floating"} />
                  <InputField name="email" label="Work email" type="email" autoComplete="email" required floating={fieldLayout === "floating"} />
                  <InputField name="password" label="Password" type="password" autoComplete="new-password" required floating={fieldLayout === "floating"} />
                  <NumberField name="seats" label="Team size" helperText="You can change this later." min={1} max={500} required />
                </div>
              </FormikStep>

              <FormikStep id="preferences" label="Preferences" style={stepStyle}>
                <div className="specimen-step">
                  <h3>Workspace preferences</h3>
                  <p>Single and multi-select, radio choices, and a boolean switch.</p>
                  <SelectField name="role" label="Primary role" options={roleOptions} required />
                  <SelectField name="tools" label="Tools you use" options={toolOptions} isMulti helperText="Choose any that apply." />
                  <RadioField name="plan" label="Workspace plan" required options={[{ label: "Starter", value: "starter" }, { label: "Team", value: "team" }, { label: "Scale", value: "scale" }]} />
                  <SwitchField name="updates" label="Send product updates" helperText="Occasional release notes; no marketing lists." />
                </div>
              </FormikStep>

              <FormikStep id="finish" label="Finish" style={stepStyle}>
                <div className="specimen-step">
                  <h3>Project brief</h3>
                  <p>Long-form input, character count, and explicit consent.</p>
                  <TextAreaField name="notes" label="What do you want to build?" maxLength={240} rows={5} showCharacterCount required />
                  <CheckBoxField name="terms" label="I accept the workspace terms" required />
                </div>
              </FormikStep>
            </FormikStepper>
          </div>

          <section className="code-panel" aria-labelledby="code-title">
            <div className="code-panel__bar">
              <div><p>Generated output</p><h3 id="code-title">JSX + theme tokens</h3></div>
              <button type="button" onClick={copyCode} aria-live="polite">
                {copyStatus === "copied" ? "Copied" : copyStatus === "failed" ? "Copy failed" : "Copy code"}
              </button>
            </div>
            <pre tabIndex={0}><code>{snippet}</code></pre>
          </section>
        </section>
      </div>
    </main>
  );
};
