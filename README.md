# Introducing the Incredible React Formik Stepper Component!

Get ready to take your form-building game to the next level with this revolutionary React component. With its seamless integration with the powerful Formik library, you'll be building forms faster and more efficiently than ever before. But that's not all - our unique validationSchema functionality means that the component won't advance to the next step unless all entries are properly validated. It's like having a personal form-checker built right in!

And don't just take our word for it - check out the example below to see the full range of props and experience the magic of the React Formik Stepper Component for yourself.

## Installation

Using npm:

```bash
npm install formik-stepper
```

Using yarn

```bash
yarn add formik-stepper
```

### Style

```jsx
/// You have to Import this line
import "formik-stepper/dist/style.css";
```

### FormikStepper Props

| Properties        | Type    | Default value | Description                                               |
| ----------------- | ------- | ------------- | --------------------------------------------------------- | --- |
| `Formik ...Props` | ......  | .....         | [Click to learn more](https://formik.org/docs/api/formik) |     |
| `withStepperLine` | Boolean | **false**     | default and If it is false, it hides stepper line         |
| `nextButton`      | Object  | ....          | [Click to learn more](#Button-Props)                      |
| `prevButton`      | Object  | ....          | [Click to learn more](#Button-Props)                      |
| `submitButton`    | Object  | ......        | [Click to learn more](#Button-Props)                      |

### FormikStepper.Step Props

| Properties | Type           | Default value | Description                                                          |
| ---------- | -------------- | ------------- | -------------------------------------------------------------------- |
| `label`    | String         | ....          | The text label of Step                                               |
| `icon`     | JSX Element    | Step Number   | to add icon into the circle must add icon as React Component         |
| `style`    | CSS Properties | ....          | [Click to learn more](https://www.w3schools.com/react/react_css.asp) |

### Button Props

| Properties | Type           | Default value | Description                                                          |
| ---------- | -------------- | ------------- | -------------------------------------------------------------------- |
| `label`    | String         | .....         | The text label of the Button                                         |
| `style`    | CSS Properties | ....          | [Click to learn more](https://www.w3schools.com/react/react_css.asp) |

### InputField Props

| Properties    | Type        | Default value    | Description                                                              |
| ------------- | ----------- | ---------------- | ------------------------------------------------------------------------ |
| `type`        | String      | **text**         | [Click to learn more](https://www.w3schools.com/tags/att_input_type.asp) |
| `label`       | String      | ....             | The text label of Input Field                                            |
| `placeholder` | String      | Value of `label` | The text placeholder of Input Field                                      |
| `floating`    | Boolean     | false            | floating Input Style                                                     |
| `component`   | JSX Element | null             | To Create your costme Input Component                                    |
