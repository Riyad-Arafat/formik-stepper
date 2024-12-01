# Introducing the Incredible React Formik Stepper Component!

Get ready to take your form-building game to the next level with this revolutionary React component. With its seamless integration with the powerful Formik library, you'll be building forms faster and more efficiently than ever before. But that's not all - our unique validationSchema functionality means that the component won't advance to the next step unless all entries are properly validated. It's like having a personal form-checker built right in!

And don't just take our word for it - check out the example below to see the full range of props and experience the magic of the React Formik Stepper Component for yourself.

## Installation

Using npm:

```bash
npm install formik-stepper
```

Using yarn:

```bash
yarn add formik-stepper
```

### Style

Import the necessary styles:

```jsx
import "formik-stepper/dist/style.css";
```

### FormikStepper Props

| Property          | Type    | Default Value | Description                                        |
| ----------------- | ------- | ------------- | -------------------------------------------------- |
| `Formik ...Props` | Various | N/A           | [Formik Props](https://formik.org/docs/api/formik) |
| `withStepperLine` | Boolean | `false`       | Show or hide the stepper line                      |
| `nextButton`      | Object  | N/A           | [Button Props](#button-props)                      |
| `prevButton`      | Object  | N/A           | [Button Props](#button-props)                      |
| `submitButton`    | Object  | N/A           | [Button Props](#button-props)                      |

### FormikStep Props

| Property | Type           | Default Value | Description                                                     |
| -------- | -------------- | ------------- | --------------------------------------------------------------- |
| `label`  | String         | N/A           | The text label of the step                                      |
| `icon`   | JSX Element    | Step Number   | Icon to display in the step circle                              |
| `style`  | CSS Properties | N/A           | [CSS Properties](https://www.w3schools.com/react/react_css.asp) |

### Button Props

| Property | Type           | Default Value | Description                                                     |
| -------- | -------------- | ------------- | --------------------------------------------------------------- |
| `label`  | String         | N/A           | The text label of the button                                    |
| `style`  | CSS Properties | N/A           | [CSS Properties](https://www.w3schools.com/react/react_css.asp) |

### InputField Props

| Property      | Type        | Default Value    | Description                                                      |
| ------------- | ----------- | ---------------- | ---------------------------------------------------------------- |
| `type`        | String      | `text`           | [Input Types](https://www.w3schools.com/tags/att_input_type.asp) |
| `label`       | String      | N/A              | The text label of the input field                                |
| `placeholder` | String      | Value of `label` | The text placeholder of the input field                          |
| `floating`    | Boolean     | `false`          | Enable floating input style                                      |
| `component`   | JSX Element | `null`           | Custom input component                                           |
