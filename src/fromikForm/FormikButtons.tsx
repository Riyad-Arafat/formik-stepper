import React, { useEffect, useState } from "react";
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
  validate,
  setFieldError,
  submitForm,
  setSubmitting,
  isSubmitting: submitting,
}: FormikButtonsProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormikErrors<FormikValues>>({});

  const Submitting = async () => {
    await validateForm()
      .then(async (e: FormikErrors<FormikValues>) => {
        setErrors(e);
      })
      .finally(async () => {
        if (validate({ errors, setTouched, setFieldError })) {
          setSubmitting(true);
          await submitForm().finally(() => console.log("finish submitting"));
        }
      });
  };

  useEffect(() => {
    setIsSubmitting(submitting);
  }, [submitting]);

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
      {step === childrenLength - 1 || childrenLength === 1 ? (
        <Button
          type="submit"
          style={{ ...submitButton?.style, marginInlineStart: "auto" }}
          color="success"
          disabled={isSubmitting}
          onClick={() => Submitting()}
        >
          {submitButton?.label || "Submit"}
        </Button>
      ) : null}
    </div>
  );
};
