# Formik Stepper v3 Accessibility Contract

This document defines the semantics that custom renderers must preserve. The default UI implements these requirements automatically.

## Step indicator

A custom `renderStepIndicator` should:

- expose the collection as navigation with an accessible name;
- represent ordered steps with an ordered list;
- mark exactly one active step with `aria-current="step"` before completion;
- communicate `complete`, `current`, `upcoming`, `error`, and `blocked` states with text, not color alone;
- keep future steps non-interactive unless the application intentionally supports direct navigation;
- retain readable labels or provide equivalent accessible names when the visual layout collapses.

The render callback receives stable step IDs and semantic statuses. Array indexes are presentation details and must not become workflow identity.

## Progress

A custom `renderProgress` should expose a determinate progress bar when it draws one:

```tsx
<div
  role="progressbar"
  aria-label="Form completion"
  aria-valuemin={1}
  aria-valuemax={steps.length}
  aria-valuenow={activeStepIndex + 1}
/>
```

Do not add another live region. `FormikStepper` owns one atomic polite status region for navigation, validation, pending work, and completion.

## Navigation

A custom `renderNavigation` must:

- render actions as native buttons;
- use `type="button"` for Back and Continue;
- call the supplied guarded callbacks rather than changing step state directly;
- disable repeated actions while `isPending` is true;
- retain a visible keyboard focus indicator and a minimum 44px target;
- use an accessible name that describes the action.

The default status region announces pending work, so custom navigation should not create a second generic loading live region.

## Validation summary

A custom `renderErrorSummary` should:

- render only after a failed navigation attempt;
- use `role="alert"` and a programmatically associated heading;
- receive focus once after that failed attempt;
- list every active-step error as a link that focuses its field;
- complement inline errors rather than replace them.

Invalid fields need a visible inline message plus `aria-invalid="true"`. Associate the message with `aria-describedby`, or use the control library's supported equivalent such as React Select's `aria-errormessage`.

## Transition failure and completion

A custom `renderTransitionError` must expose the failure as an alert and keep Retry and Dismiss keyboard accessible. Retry must call the supplied callback so duplicate-action protection and the original transition direction are preserved.

A custom `renderCompletion` should provide a visible completion heading or message. It does not need its own live region because the stepper announces successful completion centrally.

## Focus and motion

- Do not move focus during blur validation.
- After a failed Continue action, focus the validation summary.
- Preserve focus visibility in normal and forced-colors modes.
- Respect `prefers-reduced-motion` for every non-essential transition.
