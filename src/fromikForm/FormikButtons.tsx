import React, { useCallback, useMemo, useRef, useState } from "react";
import { FormikValues, useFormikContext } from "formik";
import { FormikButtonsProps, StepTransitionGuard } from "./types";
import { getStepValidationErrors, validate } from "./utils";

export const FormikButtons = ({
  step,
  goToStep,
  childrenLength,
  nextButton,
  prevButton,
  submitButton,
  currentStep,
  currentStepId,
  targetNextStepId,
  previousStepId,
  beforeNext,
  beforePrevious,
  onValidationFailure,
  onTransitionPendingChange,
}: FormikButtonsProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionInFlight = useRef(false);
  const {
    validateForm,
    setTouched,
    setFieldError,
    submitForm,
    setSubmitting,
    isSubmitting: submitting,
    values,
  } = useFormikContext<FormikValues>();

  const runGuard = useCallback(
    async (
      guard: StepTransitionGuard | undefined,
      direction: "next" | "previous",
      targetStepId: string
    ) => {
      if (!guard) return true;

      return (await guard({
        direction,
        currentStepId,
        nextStepId: targetStepId,
        values,
      })) !== false;
    },
    [currentStepId, values]
  );

  const onValidate = useCallback(
    async (isLastStep: boolean) => {
      if (transitionInFlight.current || submitting) return;

      transitionInFlight.current = true;
      setIsTransitioning(true);
      try {
        const errors = await validateForm();
        const isValid = validate({
          errors,
          setTouched,
          setFieldError,
          currentStep,
        });

        if (!isValid) {
          onValidationFailure?.(getStepValidationErrors(errors, currentStep));
          return;
        }

        onValidationFailure?.([]);

        if (isLastStep) {
          setSubmitting(true);
          await submitForm();
        } else if (
          targetNextStepId &&
          (await runGuard(beforeNext, "next", targetNextStepId))
        ) {
          goToStep(targetNextStepId);
        }
      } catch (error) {
        console.error(error);
      } finally {
        transitionInFlight.current = false;
        setIsTransitioning(false);
      }
    },
    [
      beforeNext,
      currentStep,
      targetNextStepId,
      onValidationFailure,
      runGuard,
      setFieldError,
      goToStep,
      setSubmitting,
      setTouched,
      submitForm,
      submitting,
      validateForm,
    ]
  );

  const onPrev = useCallback(async () => {
    if (transitionInFlight.current || submitting || !previousStepId) return;

    transitionInFlight.current = true;
    setIsTransitioning(true);
    try {
      if (await runGuard(beforePrevious, "previous", previousStepId)) {
        goToStep(previousStepId);
      }
    } catch (error) {
      console.error(error);
    } finally {
      transitionInFlight.current = false;
      setIsTransitioning(false);
    }
  }, [beforePrevious, goToStep, previousStepId, runGuard, submitting]);

  const isPending = isTransitioning || submitting;

  React.useEffect(() => {
    onTransitionPendingChange?.(isPending);
  }, [isPending, onTransitionPendingChange]);

  return useMemo(
    () => (
      <div style={{ marginTop: "1em", display: "flex" }}>
        {step > 0 && (
          <button
            type="button"
            className="formik-s-btn"
            onClick={onPrev}
            disabled={isPending}
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
            disabled={isPending}
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
            disabled={isPending}
            onClick={() => onValidate(true)}
          >
            {submitButton?.label || "Submit"}
          </button>
        )}
      </div>
    ),
    [
      childrenLength,
      isPending,
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
