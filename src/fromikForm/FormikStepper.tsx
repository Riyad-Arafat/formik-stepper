import React, { useEffect, useState, memo, useMemo, useCallback } from "react";
import { Form, Formik } from "formik";
import { FormikStepperProps } from "./types";
import Stepper from "../stepper";
import FormikButtons from "./FormikButtons";

export const FormikStepper: React.FC<FormikStepperProps> = memo(
  ({
    children,
    nextButton,
    prevButton,
    submitButton,
    withStepperLine,
    ...props
  }) => {
    const steps = useMemo(() => React.Children.toArray(children), [children]);

    const [step, setStep] = useState(0);
    const [currentStep, setCurrentStep] = useState(steps[step]);

    const changeCurrentStep = useCallback(() => {
      setCurrentStep(steps[step]);
    }, [step, steps]);

    useEffect(() => {
      changeCurrentStep();
    }, [changeCurrentStep]);

    const mainForm = useMemo(
      () => (
        <Form>
          {withStepperLine && steps.length > 1 && (
            <Stepper activeStep={step} steps={steps} />
          )}
          {React.isValidElement(currentStep) &&
            React.cloneElement(currentStep, {
              key: `step-${step}-${Math.random()}`,
            })}
          <FormikButtons
            nextButton={nextButton}
            prevButton={prevButton}
            submitButton={submitButton}
            step={step}
            childrenLength={steps.length}
            setStep={setStep}
            currentStep={currentStep}
          />
        </Form>
      ),
      [
        currentStep,
        nextButton,
        prevButton,
        step,
        steps,
        submitButton,
        withStepperLine,
      ]
    );

    return <Formik {...props}>{mainForm}</Formik>;
  },
  (prevProps, nextProps) => {
    const strPrev = JSON.stringify(prevProps);
    const strNext = JSON.stringify(nextProps);
    return strPrev === strNext;
  }
);

FormikStepper.displayName = "FormikStepper";

export default FormikStepper;
