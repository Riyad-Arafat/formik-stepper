import React from "react";
import { Step } from "./Step";
import "./styles.css";
import { StepProps, StepperProps } from "./types";

export const Stepper = (props: StepperProps) => {
  const activeStep = props.activeStep !== undefined ? props.activeStep : 0;

  return (
    <div className="w-100">
      <div className="stepper-horizontal">
        {React.Children.map(props.children, (child, index) => {
          const {
            labelColor,
            withIcon,
            withNumbers,
            iconColor,
            circleColor,
            children,
          }: StepProps = child?.props;
          if (child !== undefined && child.type === Step) {
            return (
              <Step
                active={activeStep >= index}
                stepNumber={index + 1}
                done={activeStep > index}
                isFirst={index === 0}
                isLast={
                  index === React.Children.toArray(props.children).length - 1
                }
                iconColor={iconColor}
                withIcon={withIcon}
                withNumbers={withNumbers}
                circleColor={circleColor}
                labelColor={labelColor}
              >
                {children}
              </Step>
            );
          }
        })}
      </div>
    </div>
  );
};
