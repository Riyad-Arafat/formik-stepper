import React, { Fragment, useState } from "react";

import { Form, Formik, FormikProps, FormikValues } from "formik";

import { FormikStepperProps, Validateprops } from "./types";

import { Stepper } from "../stepper";

import { FormikButtons } from "./index";

export const FormikStepper = ({
  children,
  nextButton,
  prevButton,
  submitButton,
  labelsColor,
  withStepperLine,
  ...props
}: FormikStepperProps) => {
  const [step, setStep] = useState(0);
  const childrenArray: any = React.Children.toArray(children);
  const currentChield = childrenArray[step];

  ////// GET All Fields Names which is in FormikStepper Component
  const getNames = (parent: JSX.Element) => {
    let names: string[] = [];
    const childrenArray: Array<any> = React.Children.toArray(
      parent.props.children
    );

    if (parent.props.name) {
      return parent.props.name;
    }
    if (childrenArray && childrenArray.length > 0) {
      for (let i = 0; i < childrenArray.length; i++) {
        let newNames = getNames(childrenArray[i]);
        if (Array.isArray(newNames)) {
          names = [...names, ...newNames];
        } else {
          names = [...names, newNames];
        }
      }
      return names;
    }
    return null;
  };

  /// validation form
  /// If there is an error in any check field, you will be alerted with the danger color
  const validate = ({
    errors,
    setTouched,
    setFieldError,
  }: Validateprops): boolean => {
    if (errors && Object.keys(errors).length > 0) {
      let valid = true;
      let obj: any = {};
      let names: string[] = getNames(currentChield);
      for (let i = 0; i < names.length; i++) {
        const nameField = names[i];
        for (let key in errors) {
          if (key === nameField) {
            valid = false;
            obj[key] = errors[key];
          } else {
            setFieldError(key, "");
          }
        }
      }

      if (valid) {
        setTouched({});
        return true;
      } else {
        setTouched(obj);
        return false;
      }
    } else {
      setTouched({});
      return true;
    }
  };

  return (
    <Fragment>
      <Formik {...props}>
        {({
          setSubmitting,
          submitForm,
          validateForm,
          setTouched,
          setFieldError,
        }: FormikProps<FormikValues>) => (
          <Form>
            {withStepperLine && (
              <div className="d-flex">
                <Stepper activeStep={step}>{childrenArray}</Stepper>
              </div>
            )}

            {currentChield}
            {/* Buttons */}
            <FormikButtons
              nextButton={nextButton}
              prevButton={prevButton}
              submitButton={submitButton}
              step={step}
              childrenLength={childrenArray.length}
              setStep={setStep}
              setTouched={setTouched}
              validate={validate}
              validateForm={validateForm}
              submitForm={submitForm}
              setSubmitting={setSubmitting}
              setFieldError={setFieldError}
            />
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};
