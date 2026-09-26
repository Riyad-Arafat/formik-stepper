# Formik Stepper v3 Release Notes

> Draft for the v3 prerelease cycle. Version numbers, dates, and final support-window details will be added during Task 6.

Formik Stepper v3 turns the library into an accessible, themeable workflow component while keeping the familiar Formik composition. It adds stable workflow identity, guarded navigation, conditional flows, explicit persistence, render slots, responsive indicator variants, and package entry points for both default and headless consumers.

## Highlights

- Stable step IDs for navigation, branching, controlled state, and draft restoration.
- Controlled and uncontrolled workflows through `activeStepId`, `initialStepId`, and `onStepChange`.
- Per-step validation schemas and asynchronous forward/backward guards.
- Duplicate-transition protection and retryable transition failures.
- Conditional forward branching with `nextStepId(values)`.
- Opt-in draft persistence through a consumer-owned adapter.
- Numbered, progress, compact, and vertical default indicators.
- CSS custom properties for colors, spacing, radii, focus, motion, and control sizing.
- Unified input, checkbox, radio, and select states with helper text, required markers, disabled/read-only presentation, and accessible inline errors.
- New textarea, numeric-value, and boolean-switch fields built on the same accessible feedback and theme contract.
- Render slots for indicators, progress, errors, navigation, transition failures, completion, and empty workflows.
- Semantic navigation, live announcements, error-summary focus, linked field errors, reduced motion, and forced-colors support.
- Separate root, core, default UI, persistence, and stylesheet exports.
- React 18 and React 19 compatibility fixtures using the packed npm artifact.

## Breaking changes

### Every step requires a stable ID

```tsx
// v2
<FormikStep label="Account">...</FormikStep>

// v3
<FormikStep id="account" label="Account">...</FormikStep>
```

IDs must be unique among the rendered steps. Use product-domain names rather than array positions because IDs can be persisted or synchronized with application routing.

### The default indicator is visible by default

In v2, omitting `withStepperLine` hid the indicator. In v3, the default indicator is shown whenever more than one step exists. Pass `withStepperLine={false}` to hide it. `withStepperLine` is otherwise deprecated; use `indicatorVariant` to select the layout.

### Styles use an exported package path

```tsx
// v2
import "formik-stepper/dist/style.css";

// v3
import "formik-stepper/styles.css";
```

JavaScript entry points never import CSS automatically. Applications control whether and where the default styles load.

### Successful submission shows a completion state

After `onSubmit` resolves, the default form is replaced with a completion surface. Use `renderCompletion` to provide product-specific confirmation content.

### Native ESM package output

v3 publishes ESM JavaScript and declarations with explicit native-ESM paths. Consumers should use an ESM-aware bundler or runtime. CommonJS `require("formik-stepper")` is not a supported v3 entry path.

### Formik is a peer dependency

Applications must install a compatible Formik 2.4 release alongside React and React DOM. This avoids bundling a second Formik instance and makes the form context boundary explicit.

## New entry points

```tsx
import { FormikStepper, FormikStep } from "formik-stepper";
import { StepperProvider, useStepper } from "formik-stepper/core";
import { FormikStepper as DefaultStepper } from "formik-stepper/default";
import { DraftPersistence } from "formik-stepper/persistence";
import "formik-stepper/styles.css";
```

Use `formik-stepper/core` for a custom visual implementation. It does not load the default fields, React Select integration, persistence implementation, or CSS.

## Compatibility

- React 18 and React DOM 18
- React 19 and React DOM 19
- Formik 2.4
- Native ESM-aware runtimes and bundlers
- Published TypeScript declarations tested with `NodeNext` resolution

Formik 2.4.6 still references the global `JSX` namespace in its own declarations. React 19 consumers that type-check dependency declarations may need `skipLibCheck: true` until Formik publishes compatible declarations. Formik Stepper's declarations use `React.JSX` and are checked independently.

## Migration

Follow [v3-migration.md](./v3-migration.md) for the full API matrix, examples, conditional navigation, persistence guidance, custom renderer responsibilities, and pre-release verification checklist.

There is no automatic step-ID codemod. Generating positional IDs would undermine stable workflow identity, so consumers must choose meaningful IDs during migration.

## Accessibility

The default UI includes semantic step navigation, `aria-current`, a persistent live region, actionable validation summaries, linked field errors, keyboard-operable password controls, focus restoration, reduced-motion handling, and forced-colors support.

Custom render slots must retain the contracts described in [v3-accessibility.md](./v3-accessibility.md).

## Package size

The current v3 artifact ships 31,614 B of runtime JavaScript, 3.8% less than the published v2.2.5 artifact by the same shipped-file measurement. Default CSS grows to cover the v3 field, state, responsive, theme, and accessibility systems. See [v3-package-size.md](./v3-package-size.md) for the methodology and budgets.

## Known prerelease work

- Complete the documentation playground and visual gallery.
- Run the responsive screenshot matrix.
- Complete manual screen-reader verification.
- Migrate representative v2 applications during the alpha/beta cycle.
- Finalize the v2 support window before the stable release.
