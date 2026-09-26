# Migrating from Formik Stepper v2 to v3

Formik Stepper v3 keeps the familiar `FormikStepper` and `FormikStep` composition, but makes workflow identity, styling, and package boundaries explicit. This guide targets applications using v2.2.5.

## Migration checklist

1. Confirm the application uses React 18 or 19, matching `react-dom`, and Formik 2.4.
2. Add a stable, unique `id` to every `FormikStep`.
3. Replace the v2 deep CSS import with `formik-stepper/styles.css`.
4. Decide whether the default indicator should remain visible. In v3 it is visible by default; use `withStepperLine={false}` to hide it.
5. Review the new completion state. After `onSubmit` resolves, v3 replaces the form with a success surface unless `renderCompletion` supplies one.
6. Exercise validation, submission, keyboard navigation, and any conditionally rendered steps before shipping.

## Minimal migration

### v2

```tsx
import { FormikStep, FormikStepper, InputField } from "formik-stepper";
import "formik-stepper/dist/style.css";

<FormikStepper
  initialValues={{ email: "", address: "" }}
  onSubmit={saveApplication}
  withStepperLine
>
  <FormikStep label="Account">
    <InputField name="email" label="Email" />
  </FormikStep>
  <FormikStep label="Address">
    <InputField name="address" label="Address" />
  </FormikStep>
</FormikStepper>;
```

### v3

```tsx
import { FormikStep, FormikStepper, InputField } from "formik-stepper";
import "formik-stepper/styles.css";

<FormikStepper
  initialValues={{ email: "", address: "" }}
  onSubmit={saveApplication}
>
  <FormikStep id="account" label="Account">
    <InputField name="email" label="Email" />
  </FormikStep>
  <FormikStep id="address" label="Address">
    <InputField name="address" label="Address" />
  </FormikStep>
</FormikStepper>;
```

Use IDs that describe the workflow step, not its current array position. IDs are used by controlled navigation, branching, draft restoration, and accessibility state. Changing an ID after release can invalidate saved drafts and external routing state.

## API matrix

| v2 API | v3 API | Migration |
| --- | --- | --- |
| `<FormikStep label="…">` | `<FormikStep id="…" label="…">` | Add a stable, unique `id`; this is required. |
| `withStepperLine` omitted | Default indicator shown | Pass `withStepperLine={false}` only when no default indicator is wanted. |
| `withStepperLine` | `indicatorVariant` | `withStepperLine` is deprecated except for hiding the indicator. Choose `numbered`, `progress`, `compact`, or `vertical`. |
| `formik-stepper/dist/style.css` | `formik-stepper/styles.css` | Use the exported aggregate stylesheet. |
| Root import only | Root, `core`, `default`, and `persistence` exports | Import from the narrowest entry when building custom UI. |
| Whole-form Formik validation | Optional `FormikStep.validationSchema` | Move step-specific rules to the corresponding step when appropriate. |
| Submission leaves the last step visible | Completion surface | Provide `renderCompletion` to customize the post-submit result. |
| Positional internal navigation | Stable-ID navigation | Use `initialStepId`, `activeStepId`, and `onStepChange` for external control. |

Existing `nextButton`, `prevButton`, and `submitButton` label/style objects remain supported. Render slots are the preferred path when controls need different markup or behavior.

## Package entry points

```tsx
// Full compatibility entry: workflow, default UI, fields, and persistence.
import { FormikStepper, FormikStep } from "formik-stepper";

// Headless workflow state only; does not import CSS or default fields.
import { StepperProvider, useStepper } from "formik-stepper/core";

// Default Formik composition and fields.
import { FormikStepper, FormikStep } from "formik-stepper/default";

// Optional draft persistence boundary.
import { DraftPersistence } from "formik-stepper/persistence";

// Explicit default styles.
import "formik-stepper/styles.css";
```

The JavaScript entry points never import CSS. This keeps server-side and headless imports safe and lets applications control stylesheet order.

## Validation and transition failures

`validationSchema` can remain on `FormikStepper` as a Formik configuration value. For step-scoped validation, place a compatible schema on each step:

```tsx
<FormikStep id="account" label="Account" validationSchema={accountSchema}>
  {/* fields */}
</FormikStep>
```

Use `beforeNext` and `beforePrevious` for asynchronous transition checks. Throwing or rejecting shows the retryable transition-error surface; returning `false` cancels the transition without reporting a failure. Values are preserved in either case.

## Conditional flows and controlled navigation

Use `nextStepId(values)` to branch forward. The returned ID must identify a currently rendered step. For router- or application-owned navigation, provide both `activeStepId` and `onStepChange`:

```tsx
<FormikStepper
  activeStepId={routeStepId}
  onStepChange={setRouteStepId}
  nextStepId={(values) => (values.isBusiness ? "company" : "confirm")}
  {...formikProps}
>
  {/* steps with matching IDs */}
</FormikStepper>
```

When conditional rendering removes the active step, the provider falls back to the nearest valid workflow state. Test this against the exact conditions used by the application.

## Draft persistence

v3 never writes to browser storage by itself. Persistence requires an explicit adapter with synchronous `load` and `save` methods. Stored drafts contain `values` and an optional `activeStepId`; version or migrate this payload in the application when field names or step IDs change.

## Styling and custom UI

The aggregate stylesheet defines the default fields and stepper. Scope brand overrides with `formClassName` and CSS custom properties rather than replacing internal class rules. Use render slots for structural changes:

- `renderStepIndicator`
- `renderProgress`
- `renderErrorSummary`
- `renderNavigation`
- `renderTransitionError`
- `renderCompletion`
- `renderEmpty`

Custom renderers take responsibility for the semantic requirements documented in [v3-accessibility.md](./v3-accessibility.md).

## Codemod policy

No v2-to-v3 codemod is currently provided. The only universal syntax change—adding step IDs—requires product-specific names, and generating positional IDs would undermine the stable identity contract. CSS import replacement is mechanical, but small enough to make directly while reviewing each consumer. The behavioral changes above require application testing and must not be automated blindly.

## Verification before release

- Every step has a stable and unique ID.
- The stylesheet is imported once from the exported path.
- The default indicator visibility is intentional.
- Submit success and submit failure preserve the expected product flow.
- Conditional branches never return an absent step ID.
- Persisted drafts tolerate renamed or removed steps.
- Keyboard navigation, focus movement, validation summaries, and custom renderer semantics pass the application accessibility checks.
- The application is tested with its production React major.
