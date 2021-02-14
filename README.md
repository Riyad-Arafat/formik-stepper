# React Formik Stepper Component

This is a reusable and scalable React component based on the `Formik` library. By adding `validationSchema` it will not go to the next step, unless the entries are validated, You can experiment and the example below illustrates the props

## Installation

Using npm:

```bash
npm install formik-stepper
```

Using yarn

```bash
yarn add formik-stepper
```

### FormikStepper Props

| Properties        | Type    | Default value | Description                                                                     |
| ----------------- | ------- | ------------- | ------------------------------------------------------------------------------- |
| `Formik ...Props` | ......  | .....         | [Click to learn more](https://formik.org/docs/api/formik)                       |
| `labelsColor`     | String  | **secondary** | The text label color can be root variables or css => #fff                       |
| `withStepperLine` | Boolean | **false**     | default and If it is false, it hides stepper line                               |
| `nextBtnLabel`    | String  | **Next**      | Label the "Moving to Next Step" button                                          |
| `prevBtnLabel`    | String  | **Prev**      | Label the "Moving to Previous Step" button                                      |
| `submitBtnLabel`  | String  | **Submit**    | Label the "Submit Form" button                                                  |
| `nextBtnColor`    | String  | **primary**   | Color the "Moving to Next Step" button can be root variables or css => #fff     |
| `prevBtnColor`    | String  | **danger**    | Color the "Moving to Previous Step" button can be root variables or css => #fff |
| `submitBtnColor`  | String  | **success**   | Color the "Submit Form" button can be root variables or css => #fff             |

### FormikStep Props

| Properties    | Type    | Default value | Description                                                                                                         |
| ------------- | ------- | ------------- | ------------------------------------------------------------------------------------------------------------------- |
| `label`       | String  | ....          | The text label of Step                                                                                              |
| `withIcons`   | String  | ....          | to add icon into the circle must add icon as class Name like [Fontawesome](https://fontawesome.com/icons?d=gallery) |
| `withNumbers` | Boolean | **true**      | If it was `true` when you added `withIcons`, it hides the icon and shows the step number                            |
| `iconColor`   | String  | white         | The color of `Step icon` can be root variables or css => #fff                                                       |
| `circleColor` | String  | blue          | The color of `Step circle` can be root variables or css => #fff                                                     |

### InputField Props

| Properties    | Type   | Default value         | Description                                                              |
| ------------- | ------ | --------------------- | ------------------------------------------------------------------------ |
| `type`        | String | **text**              | [Click to learn more](https://www.w3schools.com/tags/att_input_type.asp) |
| `label`       | String | ....                  | The text label of Input Field                                            |
| `placeholder` | String | Value of `label` prop | The text placeholder of Input Field                                      |
| `className`   | String | ....                  | The className of your custem style css                                   |
| `iconStart`   | String | ....                  | To Add icon in `prepend` of input field                                  |
| `symbol`      | String | ....                  | To `Text` in `prepend` of input field                                    |
| `label`       | String | ....                  | To Add icon in `append` of input field                                   |

## Example

```jsx
import React from "react";
import * as Yup from "yup"
import { FormikStepper, FormikStep, InputField } from "formik-stepper";



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



export const FormStepper = () => {

const onSubmit = async ( values, { setSubmitting } ) => {
      console.log(values);
      setSubmitting(false); //// Important
  };

    return(
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
            labelsColor="secondary" /// The text label color can be root variables or css => #fff
            withStepperLine /// false as default and If it is false, it hides stepper line
            nextBtnLabel="step" /// Next as default
            prevBtnLabel="return" /// Prev as default
            submitBtnLabel="Done" /// Submit as default
            nextBtnColor="primary" /// as default and The color can be root variables or css => #fff
            prevBtnColor="danger" /// as default and The color can be root variables or css => #fff
            submitBtnColor="success" /// as default and The color can be root variables or css => #fff
          >
            {/*  First Step */}
            <FormikStep
              label="Profile Info" /// The text label of Step
              withIcons="fa fa-user" // to add icon into the circle must add icon as class Name like Fontawesome
              withNumbers /// If true, it hides the icon and shows the step number
              iconColor="white" /// The color can be root variables or css => #fff
              circleColor="danger" /// The color can be root variables or css => #fff
            >
              <InputField name="firstName" label="First Name"></InputField>
              <InputField name="lastName" label="Last Name" />
            </FormikStep>
            {/* Second Step */}
            <FormikStep
              label="Login Info"
              withIcons="fa fa-lock"
              iconColor="white"
              circleColor="danger"
            >
              <InputField name="email" label="Email" type="email" />
              <InputField name="password" label="password" type="password" />
              <div>
                <InputField name="privacy" label="privacy" type="checkbox" />
              </div>
            </FormikStep>
          </FormikStepper>
    );
);
```
