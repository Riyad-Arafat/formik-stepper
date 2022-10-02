import React, { useEffect, useState } from "react";
import { FormikStepProps } from "../fromikForm/types";
import { Step } from "./Step";
import "./styles.css";
import { StepperProps } from "./types";

export const Stepper = React.memo(
  ({ activeStep: step, steps }: StepperProps) => {
    const [activeStep, setActiveStep] = useState(step);

    useEffect(() => {
      setActiveStep(step);
    }, [step]);

    return (
      <div className="w-100">
        <div className="stepper-horizontal">
          {React.Children.map(steps, (child, index) => {
            if (!React.isValidElement(child)) return null;
            const { labelColor, Icon, circleColor, label }: FormikStepProps =
              child?.props;
            return (
              <Step
                key={"step-" + index}
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
          })}
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.activeStep === nextProps.activeStep;
  }
);
