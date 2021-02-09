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

  const submitFunction = (
    values: FormikValues,
    helpers: FormikHelpers<FormikValues>
  ) => props.onSubmit(values, helpers);

  /// validation form
  /// If there is an error in any check field, you will be alerted with the danger color
  const validate = ({ errors, setTouched }: Validateprops): boolean => {
    if (errors && Object.keys(errors).length > 0) {
      let valid = true;
      let obj: any = {};
      let namesLength = currentChield.props.children.length;
      for (let i = 0; i < namesLength; i++) {
        const nameField = currentChield.props.children[i].props.name;
        for (let key in errors) {
          if (key === nameField) {
            valid = false;
            obj[key] = errors[key];
          }
        }
      }

      if (valid) {
        return true;
      } else {
        setTouched(obj);
        return false;
      }
    } else {
      return true;
    }
  };

  return (
    <Fragment>
      <Formik
        {...props}
        onSubmit={(values, helpers) => {
          submitFunction(values, helpers);
        }}
      >
        {({
          values,
          handleSubmit,
          validateForm,
          setTouched,
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
              handleSubmit={handleSubmit}
            />
          </Form>
        )}
      </Formik>
    </Fragment>
  );
};
