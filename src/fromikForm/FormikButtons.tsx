import React, { useEffect, useState } from "react";
import { FormikErrors, FormikValues } from "formik";
import { FormikButtonsProps } from "./types";
import "./style.scss";
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
          await submitForm();
        }
      });
  };

  useEffect(() => {
    setIsSubmitting(submitting);
  }, [submitting]);

  return (
    <div style={{ marginTop: "1em", display: "flex" }}>
      {step > 0 && (
        <button
          className="formik-s-btn"
          onClick={() => setStep(step - 1)}
          style={{ backgroundColor: "#f44336", ...prevButton?.style }}
        >
          {prevButton?.label || "Prev"}
        </button>
      )}
      {step < childrenLength - 1 && (
        <button
          type="submit"
          className="formik-s-btn"
          onClick={() => {
            validateForm().then((e: FormikErrors<FormikValues>) => {
              let errors = e;

              if (validate({ errors, setTouched, setFieldError }))
                setStep(step + 1);
            });
          }}
          style={{
            backgroundColor: "#04AA6D",
            ...nextButton?.style,
            marginInlineStart: "auto",
          }}
        >
          {nextButton?.label || "Next"}
        </button>
      )}
      {step === childrenLength - 1 || childrenLength === 1 ? (
        <button
          type="submit"
          className="formik-s-btn"
          style={{
            backgroundColor: "#04AA6D",
            ...submitButton?.style,
            marginInlineStart: "auto",
          }}
          disabled={isSubmitting}
          onClick={() => Submitting()}
        >
          {submitButton?.label || "Submit"}
        </button>
      ) : null}
    </div>
  );
};
