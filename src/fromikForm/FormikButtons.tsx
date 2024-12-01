import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFormikContext } from "formik";
import { FormikButtonsProps } from "./types";
import { validate } from "./utils";

export const FormikButtons = ({
  step,
  setStep,
  childrenLength,
  nextButton,
  prevButton,
  submitButton,
  currentStep,
}: FormikButtonsProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const stepObject = useRef<FormikButtonsProps["currentStep"]>(currentStep);
  const {
    validateForm,
    setTouched,
    setFieldError,
    submitForm,
    setSubmitting,
    isSubmitting: submitting,
  } = useFormikContext();

  const onValidate = useCallback(
    async (isLastStep: boolean) => {
      try {
        const errors = await validateForm();
        if (
          validate({
            errors,
            setTouched,
            setFieldError,
            currentStep: stepObject.current,
          })
        ) {
          if (isLastStep) {
            setSubmitting(true);
            await submitForm();
          } else {
            setStep(step + 1);
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    [
      setFieldError,
      setStep,
      setSubmitting,
      setTouched,
      step,
      submitForm,
      validateForm,
    ]
  );

  useEffect(() => {
    setIsSubmitting(submitting);
  }, [submitting]);

  const onPrev = useCallback(() => {
    setStep(step - 1);
  }, [setStep, step]);

  return useMemo(
    () => (
      <div style={{ marginTop: "1em", display: "flex" }}>
        {step > 0 && (
          <button
            type="button"
            className="formik-s-btn"
            onClick={onPrev}
            style={{ backgroundColor: "#f44336", ...prevButton?.style }}
          >
            {prevButton?.label || "Prev"}
          </button>
        )}
        {step < childrenLength - 1 && (
          <button
            type="button"
            className="formik-s-btn"
            onClick={() => onValidate(false)}
            style={{
              backgroundColor: "#04AA6D",
              ...nextButton?.style,
              marginInlineStart: "auto",
            }}
          >
            {nextButton?.label || "Next"}
          </button>
        )}
        {(step === childrenLength - 1 || childrenLength === 1) && (
          <button
            type="button"
            className="formik-s-btn"
            style={{
              backgroundColor: "#04AA6D",
              ...submitButton?.style,
              marginInlineStart: "auto",
            }}
            disabled={isSubmitting}
            onClick={() => onValidate(true)}
          >
            {submitButton?.label || "Submit"}
          </button>
        )}
      </div>
    ),
    [
      childrenLength,
      isSubmitting,
      nextButton?.label,
      nextButton?.style,
      onPrev,
      onValidate,
      prevButton?.label,
      prevButton?.style,
      step,
      submitButton?.label,
      submitButton?.style,
    ]
  );
};

FormikButtons.displayName = "FormikButtons";

export default React.memo(FormikButtons);
