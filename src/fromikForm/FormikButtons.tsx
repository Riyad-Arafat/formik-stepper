import React from "react";
import { Button } from "reactstrap";

import { FormikErrors, FormikValues } from "formik";
import { FormikButtonsProps } from "./types";

export const FormikButtons = ({
  step,
  setStep,
  childrenLength,
  prevBtnLabel,
  nextBtnLabel,
  submitBtnLabel,
  nextBtnColor,
  prevBtnColor,
  submitBtnColor,
  validateForm,
  setTouched,
  handleSubmit,
  validate,
}: FormikButtonsProps) => {
  return (
    <div className="w-100 d-flex justify-content-between">
      {step > 0 && (
        <Button
          onClick={() => setStep(step - 1)}
          color={prevBtnColor || "danger"}
        >
          {prevBtnLabel ? prevBtnLabel : "Prev"}
        </Button>
      )}
      {step < childrenLength - 1 && (
        <Button
          className="ml-auto"
          color={nextBtnColor || "primary"}
          onClick={() => {
            validateForm().then((e: FormikErrors<FormikValues>) => {
              let errors = e;

              if (validate({ errors, setTouched })) setStep(step + 1);
            });
          }}
        >
          {nextBtnLabel ? nextBtnLabel : "Next"}
        </Button>
      )}
      {step === childrenLength - 1 && (
        <Button
          className="ml-auto"
          color={submitBtnColor || "success"}
          onClick={(e) => {
            validateForm().then((e: FormikErrors<FormikValues>) => {
              let errors = e;
              if (validate({ errors, setTouched })) {
                handleSubmit();
              }
            });
          }}
        >
          {submitBtnLabel ? submitBtnLabel : "Submit"}
        </Button>
      )}
    </div>
  );
};
