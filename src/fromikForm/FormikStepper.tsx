import React, { Fragment, useState } from "react";

import { Form, Formik, FormikHelpers, FormikProps, FormikValues } from "formik";

import { FormikStepperProps, Validateprops, FormikStepProps } from "./types";

import { Stepper, Step } from "../stepper";

import { FormikButtons } from "./index";

export const FormikStepper = ({
  children,
  nextBtnLabel,
  prevBtnLabel,
  submitBtnLabel,
  nextBtnColor,
  prevBtnColor,
  submitBtnColor,
  labelsColor,
  withStepperLine,
  ...props
}: FormikStepperProps) => {
  const [step, setStep] = useState(0);
  const withLine = withStepperLine ? withStepperLine : false;

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
            {withLine && (
              <div className="d-flex">
                <Stepper activeStep={step}>
                  {childrenArray.map((child: any, index: number) => {
                    const {
                      label,
                      withIcons,
                      withNumbers,
                      circleColor,
                      iconColor,
                    }: FormikStepProps = child.props;

                    return (
                      <Step
                        key={index}
                        withIcons={withIcons}
                        withNumbers={withNumbers}
                        circleColor={circleColor}
                        iconColor={iconColor}
                        labelColor={labelsColor}
                      >
                        {label}
                      </Step>
                    );
                  })}
                </Stepper>
              </div>
            )}

            {currentChield}
            {/* Buttons */}
            <FormikButtons
              nextBtnLabel={nextBtnLabel}
              prevBtnLabel={prevBtnLabel}
              submitBtnLabel={submitBtnLabel}
              nextBtnColor={nextBtnColor}
              prevBtnColor={prevBtnColor}
              submitBtnColor={submitBtnColor}
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
