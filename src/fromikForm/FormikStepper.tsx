import React, { useCallback, useMemo } from "react";
import { Form, Formik } from "formik";
import { StepperProvider, useStepper } from "./StepperContext";
import { FormikStepProps, FormikStepperProps } from "./types";
import Stepper from "../stepper";
import FormikButtons from "./FormikButtons";

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
}

const FormikStepperContent = ({
  steps,
  nextButton,
  prevButton,
  submitButton,
  withStepperLine,
  beforeNext,
  beforePrevious,
}: FormikStepperContentProps) => {
  const { activeStepIndex, activeStepId, goToStep } = useStepper();
  const currentStep = steps[activeStepIndex];
  const setStep = useCallback(
    (index: number) => {
      const targetStep = steps[index];
      if (targetStep) {
        goToStep(targetStep.props.id);
      }
    },
    [goToStep, steps]
  );

  return (
    <Form>
      {withStepperLine && steps.length > 1 && (
        <Stepper activeStep={activeStepIndex} steps={steps} />
      )}
      {React.cloneElement(currentStep, { key: activeStepId })}
      <FormikButtons
        nextButton={nextButton}
        prevButton={prevButton}
        submitButton={submitButton}
        step={activeStepIndex}
        childrenLength={steps.length}
        setStep={setStep}
        currentStep={currentStep}
        currentStepId={activeStepId}
        nextStepId={steps[activeStepIndex + 1]?.props.id}
        previousStepId={steps[activeStepIndex - 1]?.props.id}
        beforeNext={beforeNext}
        beforePrevious={beforePrevious}
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
    ...props
  }) => {
    const steps = useMemo(() => React.Children.toArray(children), [children]);
    const stepElements = useMemo(() => getSteps(steps), [steps]);
    const stepDefinitions = useMemo(
      () => stepElements.map(({ props: { id } }) => ({ id })),
      [stepElements]
    );

    return (
      <Formik {...props}>
        <StepperProvider
          steps={stepDefinitions}
          initialStepId={initialStepId}
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
          />
        </StepperProvider>
      </Formik>
    );
};

FormikStepper.displayName = "FormikStepper";

export default FormikStepper;
