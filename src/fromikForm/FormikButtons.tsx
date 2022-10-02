import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { FormikErrors, FormikValues, useFormikContext } from "formik";
import { FormikButtonsProps } from "./types";
import { validate } from "./utils";

export const FormikButtons = memo(
  ({
    step,
    setStep,
    childrenLength,
    nextButton,
    prevButton,
    submitButton,
    currentStep,
  }: FormikButtonsProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
      validateForm,
      setTouched,
      setFieldError,
      submitForm,
      setSubmitting,
      isSubmitting: submitting,
    } = useFormikContext();

    const onSubmit = useCallback(async () => {
      await validateForm().then(async (e: FormikErrors<FormikValues>) => {
        let errors = e;
        if (validate({ errors, setTouched, setFieldError, currentStep })) {
          setSubmitting(true);
          await submitForm();
        }
      });
    }, [
      currentStep,
      setFieldError,
      setSubmitting,
      setTouched,
      submitForm,
      validateForm,
    ]);

    const onValidate = useCallback(() => {
      validateForm().then((e: FormikErrors<FormikValues>) => {
        let errors = e;
        if (validate({ errors, setTouched, setFieldError, currentStep }))
          setStep(step + 1);
      });
    }, [currentStep, setFieldError, setStep, setTouched, step, validateForm]);

    useEffect(() => {
      setIsSubmitting(submitting);
    }, [submitting]);

    return useMemo(
      () => (
        <div style={{ marginTop: "1em", display: "flex" }}>
          {step > 0 && (
            <button
              type="button"
              className="formik-s-btn"
              onClick={() => setStep(step - 1)}
              style={{ backgroundColor: "#f44336", ...prevButton?.style }}
            >
              {prevButton?.label || "Prev"}
            </button>
          )}
          {step < childrenLength - 1 && (
            <button
              type="button"
              className="formik-s-btn"
              onClick={onValidate}
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
              type="button"
              className="formik-s-btn"
              style={{
                backgroundColor: "#04AA6D",
                ...submitButton?.style,
                marginInlineStart: "auto",
              }}
              disabled={isSubmitting}
              onClick={onSubmit}
            >
              {submitButton?.label || "Submit"}
            </button>
          ) : null}
        </div>
      ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [
        childrenLength,
        isSubmitting,
        nextButton?.label,
        nextButton?.style,
        prevButton?.label,
        prevButton?.style,
        step,
        submitButton?.label,
        submitButton?.style,
      ]
    );
  }
);
