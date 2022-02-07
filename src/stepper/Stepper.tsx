import React, { useEffect, useMemo, useState } from "react";
import { FormikStepProps } from "../fromikForm/types";
import { Step } from "./Step";
import "./styles.css";
import { StepperProps } from "./types";

export const Stepper = ({ activeStep: step, steps }: StepperProps) => {
  const [activeStep, setActiveStep] = useState(step);

  const currentSteps = useMemo(() => {
    return React.Children.map(steps, (child, index) => {
      const { labelColor, Icon, circleColor, label }: FormikStepProps =
        child?.props;

      if (child?.type.name === "FormikStep") {
        return (
          <Step
            label={label}
            active={activeStep === index}
            done={activeStep > index}
            isFirst={index === 0}
            isLast={index === React.Children.toArray(steps).length - 1}
            Icon={() => {
              if (typeof Icon === "function")
                return Icon({
                  active: activeStep === index,
                  done: activeStep > index,
                });
              return index + 1;
            }}
            circleColor={circleColor}
            labelColor={labelColor}
          />
        );
      }
    });
  }, [activeStep, steps]);

  useEffect(() => {
    setActiveStep(step);
  }, [activeStep, step]);

  return (
    <div className="w-100">
      <div className="stepper-horizontal">{currentSteps}</div>
    </div>
  );
};
