import React from "react";
import { Button } from "reactstrap";
import { FormikErrors, FormikValues } from "formik";
import { FormikButtonsProps } from "./types";

export const FormikButtons = ({
  step,
  setStep,
  childrenLength,
  nextButton,
  prevButton,
  submitButton,
  validateForm,
  setTouched,
  setSubmitting,
  validate,
  setFieldError,
  submitForm,
}: FormikButtonsProps) => {
  return (
    <div className="w-100 d-flex justify-content-between">
      {step > 0 && (
        <Button
          color="danger"
          onClick={() => setStep(step - 1)}
          style={{ ...prevButton?.style }}
        >
          {prevButton?.label || "Prev"}
        </Button>
      )}
      {step < childrenLength - 1 && (
        <Button
          type="submit"
          color="success"
          onClick={() => {
            validateForm().then((e: FormikErrors<FormikValues>) => {
              let errors = e;

              if (validate({ errors, setTouched, setFieldError }))
                setStep(step + 1);
            });
          }}
          style={{ ...nextButton?.style, marginInlineStart: "auto" }}
        >
          {nextButton?.label || "Next"}
        </Button>
      )}
      {step === childrenLength - 1 && (
        <Button
          type="submit"
          style={{ ...submitButton?.style, marginInlineStart: "auto" }}
          color="success"
          onClick={(e) => {
            validateForm().then((e: FormikErrors<FormikValues>) => {
              let errors = e;
              if (validate({ errors, setTouched, setFieldError })) {
                submitForm().then(() => setSubmitting(true));
              }
            });
          }}
        >
          {submitButton?.label || "Submit"}
        </Button>
      )}
    </div>
  );
};
