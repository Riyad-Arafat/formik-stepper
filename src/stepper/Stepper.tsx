import React, { useEffect } from "react";
import { FormikStepProps } from "../fromikForm/types";
import { Step } from "./Step";
import "./styles.css";
import { StepperProps } from "./types";

export const Stepper = (props: StepperProps) => {
  const activeStep = props.activeStep !== undefined ? props.activeStep : 0;

  useEffect(() => {});
  return (
    <div className="w-100">
      <div className="stepper-horizontal">
        {React.Children.map(props.children, (child, index) => {
          const { labelColor, Icon, circleColor, label }: FormikStepProps =
            child?.props;

          if (child?.type.name === "FormikStep") {
            return (
              <Step
                label={label}
                active={activeStep === index}
                stepNumber={index + 1}
                done={activeStep > index}
                isFirst={index === 0}
                isLast={
                  index === React.Children.toArray(props.children).length - 1
                }
                Icon={() => {
                  if (typeof Icon === "function")
                    return Icon({
                      active: activeStep === index,
                      done: activeStep > index,
                    });
                  return null;
                }}
                circleColor={circleColor}
                labelColor={labelColor}
              ></Step>
            );
          }
        })}
      </div>
    </div>
  );
};
