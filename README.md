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
import { FormikStepper, FormikStep, InputField } from "form-aa";

const onSubmit = async (values, helpers) => {
  console.log("values", values); //// Console log All Field values
};

export const RegisterForm = () => {
    return(
        <FormikStepper
            /// Accept all Formik props
            onSubmit={onSubmit} /// onSubmit Function
            initialValues={/* Your initialValues */}
            validationSchema={/* Your validationSchema */}
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
            </FormikStep>
        </FormikStepper>
    );
);
```
