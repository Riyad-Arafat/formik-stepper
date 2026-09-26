# Formik Stepper v3 Fields

The bundled fields provide a consistent Formik binding and accessible default presentation. They are optional: applications can use any Formik-compatible controls inside `FormikStep`.

```tsx
import {
  CheckBoxField,
  InputField,
  NumberField,
  RadioField,
  SelectField,
  SwitchField,
  TextAreaField,
} from "formik-stepper/default";
import "formik-stepper/styles.css";
```

## Shared contract

All bundled fields accept:

| Property | Purpose |
| --- | --- |
| `name` | Formik value path. |
| `label` | Visible accessible label; accepts React content. |
| `helperText` | Persistent guidance connected through `aria-describedby`. |
| `required` | Applies native required semantics and shows a visual required marker where supported. |
| `disabled` | Applies native disabled behavior and the shared disabled presentation. |
| `labelColor` | Legacy label override. Prefer the `--fs-field-label` token for scoped themes. |
| `component` | Replaces the default renderer while retaining access to Formik `field`, `meta`, and `label`. |

Errors appear only after Formik marks the field touched. The default renderer connects the inline error with `aria-describedby` and `aria-errormessage`, sets `aria-invalid`, and retains helper text alongside the error.

## InputField

`InputField` accepts standard HTML input types rather than limiting consumers to text, email, and password:

```tsx
<InputField
  name="email"
  label="Work email"
  type="email"
  autoComplete="email"
  helperText="Use the address that receives account notices."
  required
/>
```

Password inputs include a keyboard-operable visibility button with pressed state and an accessible name. Pass `floating` for the compact floating-label treatment or `inline` for a desktop label/control row; inline fields stack at phone widths.

## CheckBoxField

```tsx
<CheckBoxField
  name="terms"
  label="I accept the terms"
  helperText="Review the terms before continuing."
  required
/>
```

The entire label row is the activation target. Formik receives a boolean value, while focus remains visible on the custom visual control.

## TextAreaField

```tsx
<TextAreaField
  name="notes"
  label="Delivery notes"
  helperText="Do not include payment or identity information."
  rows={5}
  maxLength={500}
  showCharacterCount
/>
```

`TextAreaField` uses a vertically resizable native textarea. The optional character count is connected to the control and includes the maximum when `maxLength` is provided.

## NumberField

```tsx
<NumberField
  name="quantity"
  label="Quantity"
  min={0}
  step={0.5}
  emptyValue={null}
/>
```

Unlike `<InputField type="number">`, `NumberField` stores non-empty values as JavaScript numbers instead of numeric strings. Empty input resolves to `""` by default or `null` when `emptyValue={null}` is provided. Native `min`, `max`, and `step` constraints remain available.

Use `NumberField` for quantities and measurements that the application models as numbers. Monetary applications should still choose a domain-safe decimal representation rather than relying on binary JavaScript numbers.

## SwitchField

```tsx
<SwitchField
  name="notifications"
  label="Order notifications"
  helperText="Receive an update when the order status changes."
/>
```

`SwitchField` stores a boolean and uses a native checkbox with `role="switch"`. Use it for an immediately applied on/off setting. Use `CheckBoxField` instead when the user is confirming a statement, accepting terms, or selecting an item from a list.

## RadioField

```tsx
<RadioField
  name="plan"
  label="Plan"
  options={[
    { label: "Starter", value: 0 },
    { label: "Professional", value: 1 },
  ]}
/>
```

Option values may be strings, numbers, or other values compared by identity. Generated DOM IDs are unique per field instance and do not depend on the option value, so repeated labels and non-string values remain valid.

## SelectField

```tsx
<SelectField
  name="country"
  label="Country"
  options={countries}
  isMulti={false}
  helperText="Choose the country used for billing."
/>
```

`SelectField` supports single and multi-value Formik state, clearing to `null`, and falsy values such as `0` or an empty string. Use `readOnly` to render the selected label through the shared read-only input treatment. The legacy lowercase `readonly` spelling remains supported for migration compatibility.

## Theme tokens

Fields inherit the stepper semantic tokens and add these optional overrides:

```css
.account-form {
  --fs-field-background: #fff;
  --fs-field-border: #aeb8c7;
  --fs-field-border-hover: #7e899b;
  --fs-field-label: #172033;
  --fs-field-placeholder: #737d8f;
  --fs-field-disabled-background: #f0f2f5;
  --fs-field-selected-background: #e9edff;
  --fs-field-gap: 1.5rem;
}
```

Use semantic tokens instead of targeting React Select's generated markup. Focus, error, disabled, reduced-motion, and forced-colors states remain owned by the default field stylesheet.
