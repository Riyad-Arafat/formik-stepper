import React, { useMemo, useState } from "react";
import { InputField } from "../../src/fields/InputField/index.ts";
import { FormikStep } from "../../src/fromikForm/FormikStep.tsx";
import { FormikStepper } from "../../src/fromikForm/FormikStepper.tsx";
import type { StepIndicatorVariant } from "../../src/fromikForm/types.ts";

type WorkflowId = "onboarding" | "checkout" | "application" | "profile";
type ThemeId = "ink" | "ocean" | "plum";

interface StepExample {
  id: string;
  label: string;
  title: string;
  description: string;
  fields: Array<{
    name: string;
    label: string;
    type: "text" | "email" | "password";
  }>;
}

interface WorkflowExample {
  name: string;
  purpose: string;
  steps: StepExample[];
}

const workflows: Record<WorkflowId, WorkflowExample> = {
  onboarding: {
    name: "Team onboarding",
    purpose: "Collect an account profile without asking for everything at once.",
    steps: [
      {
        id: "identity",
        label: "Identity",
        title: "How should your team know you?",
        description: "Use a work address so invitations reach the right inbox.",
        fields: [
          { name: "name", label: "Full name", type: "text" },
          { name: "email", label: "Work email", type: "email" },
        ],
      },
      {
        id: "security",
        label: "Security",
        title: "Protect your workspace",
        description: "Choose a password you do not use elsewhere.",
        fields: [{ name: "password", label: "Password", type: "password" }],
      },
      {
        id: "ready",
        label: "Ready",
        title: "Review your setup",
        description: "Continue to create the workspace and invite teammates.",
        fields: [],
      },
    ],
  },
  checkout: {
    name: "Checkout",
    purpose: "Keep delivery and payment context visible through purchase.",
    steps: [
      {
        id: "delivery",
        label: "Delivery",
        title: "Where should we send it?",
        description: "Enter the address where someone can receive the order.",
        fields: [
          { name: "address", label: "Street address", type: "text" },
          { name: "city", label: "City", type: "text" },
        ],
      },
      {
        id: "payment",
        label: "Payment",
        title: "Choose a payment reference",
        description: "This specimen avoids collecting real payment details.",
        fields: [{ name: "reference", label: "Purchase order", type: "text" }],
      },
      {
        id: "confirm",
        label: "Confirm",
        title: "Confirm the order",
        description: "Review delivery and payment details before placing it.",
        fields: [],
      },
    ],
  },
  application: {
    name: "Application",
    purpose: "Demonstrate a longer, formal workflow with compact progress.",
    steps: [
      {
        id: "contact",
        label: "Contact",
        title: "Start with your contact details",
        description: "We use these details only for application updates.",
        fields: [
          { name: "applicant", label: "Applicant name", type: "text" },
          { name: "contactEmail", label: "Contact email", type: "email" },
        ],
      },
      {
        id: "experience",
        label: "Experience",
        title: "Summarize your experience",
        description: "A short role or discipline is enough for this specimen.",
        fields: [{ name: "role", label: "Current role", type: "text" }],
      },
      {
        id: "availability",
        label: "Availability",
        title: "Set your availability",
        description: "Share the month when you could begin.",
        fields: [{ name: "start", label: "Available from", type: "text" }],
      },
      {
        id: "review",
        label: "Review",
        title: "Review the application",
        description: "Submit when the information is accurate.",
        fields: [],
      },
    ],
  },
  profile: {
    name: "Profile update",
    purpose: "Show a short settings flow suited to a vertical indicator.",
    steps: [
      {
        id: "public",
        label: "Public profile",
        title: "Update your public details",
        description: "These details appear anywhere your profile is linked.",
        fields: [
          { name: "displayName", label: "Display name", type: "text" },
          { name: "headline", label: "Headline", type: "text" },
        ],
      },
      {
        id: "contact",
        label: "Contact",
        title: "Update your contact address",
        description: "This address stays private and receives account notices.",
        fields: [{ name: "profileEmail", label: "Email", type: "email" }],
      },
      {
        id: "save",
        label: "Save",
        title: "Review profile changes",
        description: "Save when the public and private details are correct.",
        fields: [],
      },
    ],
  },
};

const themes: Record<ThemeId, { name: string; current: string; focus: string }> = {
  ink: { name: "Blueprint ink", current: "#3155d9", focus: "#3155d9" },
  ocean: { name: "Harbor", current: "#006d77", focus: "#005d66" },
  plum: { name: "Editorial plum", current: "#704264", focus: "#704264" },
};

const initialValues = Object.values(workflows)
  .flatMap((workflow) => workflow.steps)
  .flatMap((step) => step.fields)
  .reduce<Record<string, string>>((values, field) => {
    values[field.name] = "";
    return values;
  }, {});

const snippetFor = (
  workflow: WorkflowExample,
  variant: StepIndicatorVariant,
  theme: (typeof themes)[ThemeId],
) => `import { FormikStep, FormikStepper } from "formik-stepper";
import "formik-stepper/styles.css";

<FormikStepper
  initialValues={initialValues}
  indicatorVariant="${variant}"
  formStyle={{ "--fs-step-current": "${theme.current}" }}
  onSubmit={save}
>
${workflow.steps
  .map(
    (step) => `  <FormikStep id="${step.id}" label="${step.label}">
    {/* ${step.title} */}
  </FormikStep>`,
  )
  .join("\n")}
</FormikStepper>`;

export const Playground = () => {
  const [workflowId, setWorkflowId] = useState<WorkflowId>("onboarding");
  const [variant, setVariant] =
    useState<StepIndicatorVariant>("numbered");
  const [themeId, setThemeId] = useState<ThemeId>("ink");
  const [submissionCount, setSubmissionCount] = useState(0);

  const workflow = workflows[workflowId];
  const theme = themes[themeId];
  const snippet = useMemo(
    () => snippetFor(workflow, variant, theme),
    [theme, variant, workflow],
  );

  return (
    <main className="workbench">
      <header className="workbench__header">
        <a className="workbench__brand" href="#preview">
          <span aria-hidden="true" className="workbench__mark">FS</span>
          <span>Formik Stepper <strong>v3 workbench</strong></span>
        </a>
        <p>Real components. Editable contracts. No demo-only behavior.</p>
      </header>

      <div className="workbench__layout">
        <aside className="controls" aria-labelledby="controls-title">
          <div>
            <p className="controls__index">Configuration</p>
            <h1 id="controls-title">Shape the workflow</h1>
            <p className="controls__intro">
              Change the product context, indicator, and theme. The rendered
              form and integration code update together.
            </p>
          </div>

          <fieldset>
            <legend>Workflow</legend>
            <div className="segmented segmented--stacked">
              {(Object.entries(workflows) as Array<[WorkflowId, WorkflowExample]>).map(
                ([id, option]) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={workflowId === id}
                    onClick={() => setWorkflowId(id)}
                  >
                    <span>{option.name}</span>
                    <small>{option.steps.length} steps</small>
                  </button>
                ),
              )}
            </div>
          </fieldset>

          <label className="control-field">
            <span>Indicator</span>
            <select
              value={variant}
              onChange={(event) =>
                setVariant(event.target.value as StepIndicatorVariant)
              }
            >
              <option value="numbered">Numbered rail</option>
              <option value="progress">Progress bar</option>
              <option value="compact">Compact context</option>
              <option value="vertical">Vertical rail</option>
            </select>
          </label>

          <fieldset>
            <legend>Theme token set</legend>
            <div className="theme-options">
              {(Object.entries(themes) as Array<[ThemeId, (typeof themes)[ThemeId]]>).map(
                ([id, option]) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={themeId === id}
                    onClick={() => setThemeId(id)}
                  >
                    <span
                      className="theme-options__swatch"
                      style={{ backgroundColor: option.current }}
                      aria-hidden="true"
                    />
                    {option.name}
                  </button>
                ),
              )}
            </div>
          </fieldset>
        </aside>

        <section className="preview" id="preview" aria-labelledby="preview-title">
          <div className="preview__heading">
            <div>
              <p className="preview__status">Live specimen</p>
              <h2 id="preview-title">{workflow.name}</h2>
              <p>{workflow.purpose}</p>
            </div>
            <span className="preview__variant">{variant}</span>
          </div>

          <div className="preview__canvas">
            <FormikStepper
              key={`${workflowId}-${variant}-${themeId}-${submissionCount}`}
              initialValues={initialValues}
              indicatorVariant={variant}
              formClassName="specimen-form"
              formStyle={
                {
                  "--fs-step-current": theme.current,
                  "--fs-focus-ring": theme.focus,
                  "--fs-button-primary-hover": theme.focus,
                } as React.CSSProperties
              }
              onSubmit={async () => {
                await new Promise((resolve) => window.setTimeout(resolve, 500));
              }}
              renderCompletion={() => (
                <div className="specimen-completion" role="status">
                  <span aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22">
                      <path
                        d="m5 12.5 4.25 4.25L19 7"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.25"
                      />
                    </svg>
                  </span>
                  <h3>{workflow.name} complete</h3>
                  <p>The success state can carry the product’s next action.</p>
                  <button
                    type="button"
                    className="formik-s-btn formik-s-btn--secondary"
                    onClick={() => setSubmissionCount((count) => count + 1)}
                  >
                    Restart specimen
                  </button>
                </div>
              )}
            >
              {workflow.steps.map((step) => (
                <FormikStep key={step.id} id={step.id} label={step.label}>
                  <div className="specimen-step">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                    {step.fields.map((field) => (
                      <InputField
                        key={field.name}
                        name={field.name}
                        label={field.label}
                        type={field.type}
                      />
                    ))}
                  </div>
                </FormikStep>
              ))}
            </FormikStepper>
          </div>

          <details className="code-panel">
            <summary>Integration code</summary>
            <pre tabIndex={0}><code>{snippet}</code></pre>
          </details>
        </section>
      </div>
    </main>
  );
};
