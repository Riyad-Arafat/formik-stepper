import React, { useCallback, useMemo, useState } from "react";
import {
  FormikErrors,
  FormikValues,
  useFormikContext,
  validateYupSchema,
  yupToFormErrors,
} from "formik";
import {
  FormikButtonsProps,
  StepTransitionFailure,
  StepTransitionGuard,
  TransitionErrorRenderProps,
} from "./types";
import { getStepValidationErrors, validate } from "./utils";

class TransitionLock {
  private active = false;

  acquire() {
    if (this.active) return false;
    this.active = true;
    return true;
  }

  release() {
    this.active = false;
  }
}

interface DefaultTransitionErrorProps extends TransitionErrorRenderProps {
  isPending: boolean;
}

const DefaultTransitionError = ({
  failure,
  retry,
  dismiss,
  isPending,
}: DefaultTransitionErrorProps) => {
  const alertRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    alertRef.current?.focus();
  }, []);

  return (
    <div
      className="fs-transition-error"
      role="alert"
      tabIndex={-1}
      ref={alertRef}
    >
      <p className="fs-transition-error__message">{failure.message}</p>
      <div className="fs-transition-error__actions">
        <button
          type="button"
          className="formik-s-btn formik-s-btn--primary"
          onClick={retry}
          disabled={isPending}
        >
          Retry
        </button>
        <button
          type="button"
          className="formik-s-btn formik-s-btn--secondary"
          onClick={dismiss}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export const FormikButtons = ({
  step,
  goToStep,
  childrenLength,
  nextButton,
  prevButton,
  submitButton,
  currentStep,
  currentStepId,
  stepValidationSchema,
  targetNextStepId,
  previousStepId,
  beforeNext,
  beforePrevious,
  onValidationFailure,
  onTransitionPendingChange,
  renderNavigation,
  onTransitionError,
  renderTransitionError,
  onSubmissionSuccess,
}: FormikButtonsProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [failedAction, setFailedAction] = useState<{
    failure: StepTransitionFailure;
    submit: boolean;
    trigger: HTMLElement | null;
  } | null>(null);
  const transitionLock = useMemo(() => new TransitionLock(), []);
  const {
    validateForm,
    setTouched,
    setFieldError,
    setErrors,
    submitForm,
    setSubmitting,
    isSubmitting: submitting,
    values,
  } = useFormikContext<FormikValues>();

  const validateCurrentStep = useCallback(async () => {
    if (!stepValidationSchema) return validateForm();

    const schema =
      typeof stepValidationSchema === "function"
        ? stepValidationSchema(values)
        : stepValidationSchema;

    try {
      await validateYupSchema(values, schema);
      setErrors({});
      return {};
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "name" in error &&
        error.name === "ValidationError"
      ) {
        const errors = yupToFormErrors<FormikValues>(error);
        setErrors(errors);
        return errors;
      }
      throw error;
    }
  }, [setErrors, stepValidationSchema, validateForm, values]);

  const recordFailure = useCallback(
    (
      error: unknown,
      direction: "next" | "previous",
      nextStepId: string,
      submit = false,
    ) => {
      const failure: StepTransitionFailure = {
        direction,
        currentStepId,
        nextStepId,
        values,
        error,
        message:
          error instanceof Error
            ? error.message
            : "The step could not be changed. Please try again.",
      };
      const trigger =
        typeof document !== "undefined" &&
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      setFailedAction({ failure, submit, trigger });
      onTransitionError?.(failure);
    },
    [currentStepId, onTransitionError, values],
  );

  const runGuard = useCallback(
    async (
      guard: StepTransitionGuard | undefined,
      direction: "next" | "previous",
      targetStepId: string,
    ) => {
      if (!guard) return true;

      return (
        (await guard({
          direction,
          currentStepId,
          nextStepId: targetStepId,
          values,
        })) !== false
      );
    },
    [currentStepId, values],
  );

  const onValidate = useCallback(
    async (isLastStep: boolean) => {
      if (submitting || !transitionLock.acquire()) return;

      setIsTransitioning(true);
      setFailedAction(null);
      try {
        const errors: FormikErrors<FormikValues> = await validateCurrentStep();
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
          onSubmissionSuccess?.();
        } else if (
          targetNextStepId &&
          (await runGuard(beforeNext, "next", targetNextStepId))
        ) {
          goToStep(targetNextStepId);
        }
      } catch (error) {
        recordFailure(
          error,
          "next",
          targetNextStepId ?? currentStepId,
          isLastStep,
        );
      } finally {
        transitionLock.release();
        setIsTransitioning(false);
      }
    },
    [
      beforeNext,
      currentStep,
      currentStepId,
      targetNextStepId,
      onValidationFailure,
      onSubmissionSuccess,
      recordFailure,
      runGuard,
      setFieldError,
      goToStep,
      setSubmitting,
      setTouched,
      submitForm,
      submitting,
      transitionLock,
      validateCurrentStep,
    ],
  );

  const onPrev = useCallback(async () => {
    if (submitting || !previousStepId || !transitionLock.acquire()) return;

    setIsTransitioning(true);
    setFailedAction(null);
    try {
      if (await runGuard(beforePrevious, "previous", previousStepId)) {
        goToStep(previousStepId);
      }
    } catch (error) {
      recordFailure(error, "previous", previousStepId);
    } finally {
      transitionLock.release();
      setIsTransitioning(false);
    }
  }, [
    beforePrevious,
    goToStep,
    previousStepId,
    runGuard,
    recordFailure,
    submitting,
    transitionLock,
  ]);

  const isPending = isTransitioning || submitting;
  const onNext = useCallback(() => onValidate(false), [onValidate]);
  const onSubmit = useCallback(() => onValidate(true), [onValidate]);
  const dismissFailure = useCallback(() => {
    const trigger = failedAction?.trigger;
    setFailedAction(null);
    trigger?.focus();
  }, [failedAction]);
  const retryFailure = useCallback(async () => {
    if (!failedAction) return;
    const { direction } = failedAction.failure;
    const submit = failedAction.submit;
    setFailedAction(null);
    if (direction === "previous") await onPrev();
    else await onValidate(submit);
  }, [failedAction, onPrev, onValidate]);

  React.useEffect(() => {
    onTransitionPendingChange?.(isPending);
  }, [isPending, onTransitionPendingChange]);

  const navigation = useMemo(() => {
    if (renderNavigation) {
      return renderNavigation({
        isFirstStep: step === 0,
        isLastStep: step === childrenLength - 1,
        isPending,
        onNext,
        onPrevious: onPrev,
        onSubmit,
      });
    }

    return (
      <div className="fs-navigation">
        {isPending && (
          <span className="fs-navigation__status" aria-hidden="true">
            Working…
          </span>
        )}
        {step > 0 && (
          <button
            type="button"
            className="formik-s-btn formik-s-btn--secondary"
            onClick={onPrev}
            disabled={isPending}
            aria-busy={isPending || undefined}
            style={prevButton?.style}
          >
            {prevButton?.label || "Prev"}
          </button>
        )}
        {step < childrenLength - 1 && (
          <button
            type="button"
            className="formik-s-btn formik-s-btn--primary"
            onClick={onNext}
            disabled={isPending}
            aria-busy={isPending || undefined}
            style={{
              ...nextButton?.style,
            }}
          >
            {nextButton?.label || "Next"}
          </button>
        )}
        {(step === childrenLength - 1 || childrenLength === 1) && (
          <button
            type="button"
            className="formik-s-btn formik-s-btn--primary"
            style={{
              ...submitButton?.style,
            }}
            disabled={isPending}
            aria-busy={isPending || undefined}
            onClick={onSubmit}
          >
            {submitButton?.label || "Submit"}
          </button>
        )}
      </div>
    );
  }, [
    childrenLength,
    isPending,
    nextButton?.label,
    nextButton?.style,
    onPrev,
    onNext,
    onSubmit,
    prevButton?.label,
    prevButton?.style,
    step,
    submitButton?.label,
    submitButton?.style,
    renderNavigation,
  ]);
  const transitionError = failedAction
    ? renderTransitionError?.({
        failure: failedAction.failure,
        retry: retryFailure,
        dismiss: dismissFailure,
      }) ?? (
        <DefaultTransitionError
          failure={failedAction.failure}
          retry={retryFailure}
          dismiss={dismissFailure}
          isPending={isPending}
        />
      )
    : null;

  return (
    <>
      {transitionError}
      {navigation}
    </>
  );
};

FormikButtons.displayName = "FormikButtons";

export default React.memo(FormikButtons);
