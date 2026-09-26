import React, { useMemo, useState } from "react";
import { Form, Formik, FormikValues, useFormikContext } from "formik";
import { StepperProvider, useStepper } from "./StepperContext";
import { FormikStepProps, FormikStepperProps } from "./types";
import Stepper from "../stepper";
import FormikButtons from "./FormikButtons";
import { ErrorSummary } from "./ErrorSummary";
import { StepValidationError, StepperDraftAdapter } from "./types";
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
  nextButton?: FormikStepperProps["nextButton"];
  prevButton?: FormikStepperProps["prevButton"];
  submitButton?: FormikStepperProps["submitButton"];
  withStepperLine?: boolean;
  beforeNext?: FormikStepperProps["beforeNext"];
  beforePrevious?: FormikStepperProps["beforePrevious"];
  nextStepId?: FormikStepperProps["nextStepId"];
  draftAdapter?: StepperDraftAdapter;
}

const FormikStepperContent = ({
  steps,
  nextButton,
  prevButton,
  submitButton,
  withStepperLine,
  beforeNext,
  beforePrevious,
  nextStepId,
  draftAdapter,
}: FormikStepperContentProps) => {
  const { activeStepIndex, activeStepId, goToStep } = useStepper();
  const { values } = useFormikContext<FormikValues>();
  const [validationErrors, setValidationErrors] = useState<StepValidationError[]>([]);
  const [isTransitionPending, setIsTransitionPending] = useState(false);
  const currentStep = steps[activeStepIndex];
  const targetNextStepId =
    nextStepId?.(values) ?? steps[activeStepIndex + 1]?.props.id;

  if (
    targetNextStepId &&
    !steps.some((step) => step.props.id === targetNextStepId)
  ) {
    throw new Error(`nextStepId returned an unknown step id: ${targetNextStepId}`);
  }

  return (
    <Form>
      {withStepperLine && steps.length > 1 && (
        <Stepper
          activeStep={activeStepIndex}
          steps={steps}
          errorStep={validationErrors.length > 0 ? activeStepIndex : undefined}
          blocked={isTransitionPending}
        />
      )}
      <ErrorSummary errors={validationErrors} />
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
        targetNextStepId={targetNextStepId}
        previousStepId={steps[activeStepIndex - 1]?.props.id}
        beforeNext={beforeNext}
        beforePrevious={beforePrevious}
        onValidationFailure={setValidationErrors}
        onTransitionPendingChange={setIsTransitionPending}
      />
    </Form>
  );
};

export const FormikStepper: React.FC<FormikStepperProps> = ({
    children,
    nextButton,
    prevButton,
    submitButton,
    withStepperLine,
    initialStepId,
    activeStepId,
    onStepChange,
    beforeNext,
    beforePrevious,
    nextStepId,
    draftAdapter,
    ...props
  }) => {
    const draft = useMemo(() => draftAdapter?.load() ?? null, [draftAdapter]);
    const steps = useMemo(() => React.Children.toArray(children), [children]);
    const stepElements = useMemo(() => getSteps(steps), [steps]);
    const stepDefinitions = useMemo(
      () => stepElements.map(({ props: { id } }) => ({ id })),
      [stepElements]
    );

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
            nextButton={nextButton}
            prevButton={prevButton}
            submitButton={submitButton}
            withStepperLine={withStepperLine}
            beforeNext={beforeNext}
            beforePrevious={beforePrevious}
            nextStepId={nextStepId}
            draftAdapter={draftAdapter}
          />
        </StepperProvider>
      </Formik>
    );
};

FormikStepper.displayName = "FormikStepper";

export default FormikStepper;
