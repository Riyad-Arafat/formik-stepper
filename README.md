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

## Usage

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



export const RegisterForm = () => {

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
