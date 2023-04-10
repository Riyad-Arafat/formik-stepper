import React, { useEffect, useState } from "react";
import { FormikStepProps } from "../fromikForm/types";
import Step from "./Step";
import { StepperProps } from "./types";
import "./styles.css";
const Stepper = ({ activeStep: step, steps }: StepperProps) => {
  const [activeStep, setActiveStep] = useState(step);

  useEffect(() => {
    setActiveStep(step);
  }, [step]);

  return (
    <>
      <div className="stepper-horizontal">
        {React.Children.map(steps, (child, index) => {
          if (!React.isValidElement(child)) return null;
          const { icon, label } = child.props as FormikStepProps;
          return (
            <Step
              key={`step-${index}`}
              label={label}
              active={activeStep === index}
              done={activeStep > index}
              isFirst={index === 0}
              isLast={index === React.Children.count(steps) - 1}
              icon={
                typeof icon === "function"
                  ? icon({
                      active: activeStep === index,
                      done: activeStep > index,
                    })
                  : index + 1
              }
            />
          );
        })}
      </div>
    </>
  );
};

export default React.memo(
  Stepper,
  (props, nextProps) => props.activeStep === nextProps.activeStep
);
