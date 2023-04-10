import React, {
  Fragment,
  useEffect,
  useState,
  memo,
  useMemo,
  useCallback,
} from "react";

import { Form, Formik } from "formik";

import { FormikStepperProps } from "./types";

import Stepper from "../stepper";

import FormikButtons from "./FormikButtons";

const FormikStepper = memo(
  ({
    children,
    nextButton,
    prevButton,
    submitButton,
    withStepperLine,
    ...props
  }: FormikStepperProps) => {
    const steps = React.useMemo(() => {
      return React.Children.toArray(children);
    }, [children]);

    const [step, setStep] = useState(0);
    const [currentStep, setcurrentStep] = useState(steps[step]);

    const changeCurrentStep = useCallback(() => {
      setcurrentStep(steps[step]);
    }, [step, steps]);

    useEffect(() => {
      changeCurrentStep();
    }, [changeCurrentStep]);

    const mainForm = useMemo(() => {
      return (
        <Form>
          {withStepperLine && steps.length > 1 ? (
            <Stepper activeStep={step} steps={steps} />
          ) : null}

          {React.isValidElement(currentStep) &&
            React.cloneElement(currentStep, { key: `step-${step}` })}
          {/* Buttons */}
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
      );
    }, [
      currentStep,
      nextButton,
      prevButton,
      step,
      steps,
      submitButton,
      withStepperLine,
    ]);

    return (
      <Fragment>
        <Formik {...props}>{mainForm}</Formik>
      </Fragment>
    );
  }
);

export default FormikStepper;
