# React Formik Stepper Component

This is a reusable and scalable React component based on the `Formik` library. By adding `validationSchema` it will not go to the next step, unless the entries are validated, You can experiment and the example below illustrates the props

## What's New !!?

> This is the second version of that package in which we have added some new features and improved performance and reduced some of the props in some components in order to help ease of use. And we have added some new input fields like [SelectField, RadioField].
> I hope you like it :)

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

| Properties    | Type        | Default value | Description                                                  |
| ------------- | ----------- | ------------- | ------------------------------------------------------------ |
| `Formik ...Props` | ...... | ..... | [Click to learn more](https://formik.org/docs/api/formik) | |
| `withStepperLine` | Boolean | **false** | default and If it is false, it hides stepper line |
| `nextButton` | Object | .... | [Click to learn more](#Button-Props) |
| `prevButton` | Object | .... | [Click to learn more](#Button-Props) |
| `submitButton` | Object | ...... | [Click to learn more](#Button-Props) |

### FormikStep Props

| Properties    | Type        | Default value | Description                                                  |
| ------------- | ----------- | ------------- | ------------------------------------------------------------ |
| `label`       | String      | ....          | The text label of Step                                       |
| `Icon`        | JSX Element | Step Number   | to add icon into the circle must add icon as React Component |
| `labelColor`  | String      | #000          | The text label color can be CSS colors as ( #fff )           |
| `circleColor` | String      | #2196f3       | The text label color can be CSS colors as ( #fff )           |

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

## Example

```jsx
import { IoAdd, IoBalloonSharp } from "react-icons/io5";


import * as Yup from "yup";
import {
  FormikStepper,
  FormikStep,
  InputField,
  CheckBoxField,
  RadioField,
  SelectField,
  FormikHelpers,
} from "formik-stepper";
/// You have to Import this line to 
import "formik-stepper/dist/style.css";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("The First Name field is required"),
  lastName: Yup.string().required("The Last Name field is required"),
  email: Yup.string()
    .email("The email must be a valid email address.")
    .required("The Email field is required"),
  password: Yup.string()
    .required("The Password field is required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*)[A-Za-z\d]{8,}$/,
      `Must Contain 8 Characters, One Uppercase, One Lowercase,
      One Number and one special case Character [@$!%*#?&-_]`
    ),
  privacy: Yup.boolean()
    .isTrue()
    .oneOf([true], "The terms and conditions must be accepted."),
});

export const Form = () => {
  const onSubmit = async (
    values: any,
    { setSubmitting }: FormikHelpers<any>
  ) => {
    console.log(values);
  };

  return (
    <FormikStepper
      /// Accept all Formik props
      onSubmit={onSubmit} /// onSubmit Function
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        privacy: false,
      }}
      validationSchema={validationSchema}
      withStepperLine /// false as default and If it is false, it hides stepper line
      nextButton={{ label: "Step" }}
      prevButton={{ label: "Back" }}
      submitButton={{ label: "Done", style: { background: "blue" } }}
    >
      {/*  First Step */}
      <FormikStep
        label="Profile Info" /// The text label of Step
        labelColor="#37bf5e" /// css-colors => #fff
        circleColor="#37bf5e" /// css-colors => #fff
        Icon={({ active, done }) => {
          console.log({ active, done });
          if (active) return <IoAdd />;
          else return <IoBalloonSharp />;
        }}
      >
        <InputField name="firstName" label="First Name" floating />
        <InputField name="lastName" label="Last Name" floating />

        <div>
          <SelectField
            label="select"
            name="select"
            labelColor="#dc3545"
            placeholder="select"
            isMulti
            options={[
              { value: "one", label: "one" },
              { value: "tow", label: "tow" },
              { value: "three", label: "three" },
            ]}
          />
        </div>
      </FormikStep>
      {/* Second Step */}
      <FormikStep label="Login Info" circleColor="#6f42c1">
        <InputField name="email" label="Email" type="email" />
        <InputField name="password" label="password" type="password" floating />
        <div>
          <CheckBoxField name="privacy" label="privacy" />
        </div>
        <RadioField
          name="RadioField"
          label="Radio"
          labelColor="#000"
          options={[
            { label: "one.", value: "one" },
            { label: "tow.", value: "tow" },
          ]}
        />
      </FormikStep>
    </FormikStepper>
  );
};
```
