import React, { useMemo, useState } from "react";
import { Form, Formik, FormikValues, useFormikContext } from "formik";
import { StepperProvider, useStepper } from "./StepperContext";
import { FormikStepProps, FormikStepperProps } from "./types";
import Stepper from "../stepper";
import FormikButtons from "./FormikButtons";
import { ErrorSummary } from "./ErrorSummary";
import {
  StepIndicatorRenderProps,
  StepValidationError,
  StepperDraftAdapter,
} from "./types";
import { DraftPersistence } from "./DraftPersistence";

type FormikStepElement = React.ReactElement<FormikStepProps>;

const getSteps = (children: React.ReactNode): FormikStepElement[] => {
  const steps = React.Children.toArray(children).filter(
    (child): child is FormikStepElement =>
      React.isValidElement<FormikStepProps>(child)
  );
  const stepIds = new Set<string>();

  steps.forEach(({ props: { id } }) => {
    if (!id) {
      throw new Error("Every FormikStep requires a stable id.");
    }
    if (stepIds.has(id)) {
      throw new Error(`FormikStep ids must be unique. Duplicate id: ${id}`);
    }
    stepIds.add(id);
  });

  return steps;
};

interface FormikStepperContentProps {
  steps: FormikStepElement[];
  formClassName?: string;
  formStyle?: React.CSSProperties;
  nextButton?: FormikStepperProps["nextButton"];
  prevButton?: FormikStepperProps["prevButton"];
  submitButton?: FormikStepperProps["submitButton"];
  withStepperLine?: boolean;
  indicatorVariant?: FormikStepperProps["indicatorVariant"];
  beforeNext?: FormikStepperProps["beforeNext"];
  beforePrevious?: FormikStepperProps["beforePrevious"];
  nextStepId?: FormikStepperProps["nextStepId"];
  draftAdapter?: StepperDraftAdapter;
  renderStepIndicator?: FormikStepperProps["renderStepIndicator"];
  renderProgress?: FormikStepperProps["renderProgress"];
  renderErrorSummary?: FormikStepperProps["renderErrorSummary"];
  renderNavigation?: FormikStepperProps["renderNavigation"];
  onTransitionError?: FormikStepperProps["onTransitionError"];
  renderTransitionError?: FormikStepperProps["renderTransitionError"];
  renderCompletion?: FormikStepperProps["renderCompletion"];
}

const FormikStepperContent = ({
  steps,
  formClassName,
  formStyle,
  nextButton,
  prevButton,
  submitButton,
  withStepperLine,
  indicatorVariant,
  beforeNext,
  beforePrevious,
  nextStepId,
  draftAdapter,
  renderStepIndicator,
  renderProgress,
  renderErrorSummary,
  renderNavigation,
  onTransitionError,
  renderTransitionError,
  renderCompletion,
}: FormikStepperContentProps) => {
  const { activeStepIndex, activeStepId, goToStep } = useStepper();
  const { values } = useFormikContext<FormikValues>();
  const [validationErrors, setValidationErrors] = useState<StepValidationError[]>([]);
  const [isTransitionPending, setIsTransitionPending] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const currentStep = steps[activeStepIndex];
  const targetNextStepId =
    nextStepId?.(values) ?? steps[activeStepIndex + 1]?.props.id;
  const statusMessage = isComplete
    ? "Completed. Your information was submitted successfully."
    : validationErrors.length > 0
      ? `${validationErrors.length} validation ${
          validationErrors.length === 1 ? "error" : "errors"
        } on step ${activeStepIndex + 1} of ${steps.length}.`
      : isTransitionPending
        ? `Working on step ${activeStepIndex + 1} of ${steps.length}.`
        : `Step ${activeStepIndex + 1} of ${steps.length}.`;
  const indicatorProps = useMemo<StepIndicatorRenderProps>(
    () => ({
      activeStepId,
      activeStepIndex,
      steps: steps.map((step, index) => ({
        id: step.props.id,
        label: step.props.label,
        status:
          isComplete || index < activeStepIndex
            ? "complete"
            : index > activeStepIndex
              ? "upcoming"
              : validationErrors.length > 0
                ? "error"
                : isTransitionPending
                  ? "blocked"
                  : "current",
      })),
    }),
    [
      activeStepId,
      activeStepIndex,
      isTransitionPending,
      isComplete,
      steps,
      validationErrors.length,
    ]
  );

  if (
    targetNextStepId &&
    !steps.some((step) => step.props.id === targetNextStepId)
  ) {
    throw new Error(`nextStepId returned an unknown step id: ${targetNextStepId}`);
  }

  return (
    <Form
      className={["fs-form", formClassName].filter(Boolean).join(" ")}
      style={formStyle}
    >
      {renderStepIndicator?.(indicatorProps)}
      {!renderStepIndicator && withStepperLine !== false && steps.length > 1 && (
        <Stepper
          activeStep={activeStepIndex}
          steps={steps}
          errorStep={validationErrors.length > 0 ? activeStepIndex : undefined}
          blocked={isTransitionPending}
          complete={isComplete}
          variant={indicatorVariant}
        />
      )}
      {renderProgress?.(indicatorProps)}
      <span
        className="fs-visually-hidden"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {statusMessage}
      </span>
      {isComplete ? (
        renderCompletion?.({ values }) ?? (
          <div className="fs-completion">
            <h2 className="fs-completion__title">Completed</h2>
            <p className="fs-completion__message">
              Your information was submitted successfully.
            </p>
          </div>
        )
      ) : (
        <>
          {renderErrorSummary ? (
            renderErrorSummary({ errors: validationErrors })
          ) : (
            <ErrorSummary errors={validationErrors} />
          )}
          {React.cloneElement(currentStep, { key: activeStepId })}
          {draftAdapter && <DraftPersistence adapter={draftAdapter} />}
          <FormikButtons
            nextButton={nextButton}
            prevButton={prevButton}
            submitButton={submitButton}
            step={activeStepIndex}
            childrenLength={steps.length}
            goToStep={goToStep}
            currentStep={currentStep}
            currentStepId={activeStepId}
            stepValidationSchema={currentStep.props.validationSchema}
            targetNextStepId={targetNextStepId}
            previousStepId={steps[activeStepIndex - 1]?.props.id}
            beforeNext={beforeNext}
            beforePrevious={beforePrevious}
            onValidationFailure={setValidationErrors}
            onTransitionPendingChange={setIsTransitionPending}
            renderNavigation={renderNavigation}
            onTransitionError={onTransitionError}
            renderTransitionError={renderTransitionError}
            onSubmissionSuccess={() => setIsComplete(true)}
          />
        </>
      )}
    </Form>
  );
};

export const FormikStepper: React.FC<FormikStepperProps> = ({
    children,
    formClassName,
    formStyle,
    nextButton,
    prevButton,
    submitButton,
    withStepperLine,
    indicatorVariant,
    initialStepId,
    activeStepId,
    onStepChange,
    beforeNext,
    beforePrevious,
    nextStepId,
    draftAdapter,
    renderStepIndicator,
    renderProgress,
    renderErrorSummary,
    renderNavigation,
    onTransitionError,
    renderTransitionError,
    renderCompletion,
    renderEmpty,
    ...props
  }) => {
    const draft = useMemo(() => draftAdapter?.load() ?? null, [draftAdapter]);
    const steps = useMemo(() => React.Children.toArray(children), [children]);
    const stepElements = useMemo(() => getSteps(steps), [steps]);
    const stepDefinitions = useMemo(
      () => stepElements.map(({ props: { id } }) => ({ id })),
      [stepElements]
    );

    if (stepElements.length === 0) {
      return (
        <Formik {...props} initialValues={draft?.values ?? props.initialValues}>
          <Form
            className={["fs-form", formClassName].filter(Boolean).join(" ")}
            style={formStyle}
          >
            {renderEmpty?.() ?? (
              <div className="fs-empty" role="status">
                No steps are available.
              </div>
            )}
          </Form>
        </Formik>
      );
    }

    return (
      <Formik {...props} initialValues={draft?.values ?? props.initialValues}>
        <StepperProvider
          steps={stepDefinitions}
          initialStepId={initialStepId ?? draft?.activeStepId}
          activeStepId={activeStepId}
          onStepChange={onStepChange}
        >
          <FormikStepperContent
            steps={stepElements}
            formClassName={formClassName}
            formStyle={formStyle}
            nextButton={nextButton}
            prevButton={prevButton}
            submitButton={submitButton}
            withStepperLine={withStepperLine}
            indicatorVariant={indicatorVariant}
            beforeNext={beforeNext}
            beforePrevious={beforePrevious}
            nextStepId={nextStepId}
            draftAdapter={draftAdapter}
            renderStepIndicator={renderStepIndicator}
            renderProgress={renderProgress}
            renderErrorSummary={renderErrorSummary}
            renderNavigation={renderNavigation}
            onTransitionError={onTransitionError}
            renderTransitionError={renderTransitionError}
            renderCompletion={renderCompletion}
          />
        </StepperProvider>
      </Formik>
    );
};

FormikStepper.displayName = "FormikStepper";

export default FormikStepper;
