import React from "react";
import { FormikStepProps } from "../fromikForm/types.ts";
import Step from "./Step.tsx";
import { StepperProps } from "./types.ts";

const Stepper: React.FC<StepperProps> = ({
  activeStep: step,
  errorStep,
  blocked,
  complete = false,
  steps,
  variant = "numbered",
}) => {
  const activeStep = step;
  const stepCount = React.Children.count(steps);
  const activeChild = React.Children.toArray(steps)[activeStep];
  const activeLabel = React.isValidElement<FormikStepProps>(activeChild)
    ? activeChild.props.label
    : undefined;
  const progress = complete ? 100 : ((activeStep + 1) / stepCount) * 100;

  if (variant === "progress" || variant === "compact") {
    return (
      <nav
        className={`fs-stepper fs-stepper--${variant}`}
        aria-label="Form progress"
      >
        <div className="fs-stepper__context">
          <span className="fs-stepper__count">
            {complete ? "Completed" : `Step ${activeStep + 1} of ${stepCount}`}
          </span>
          {!complete && activeLabel && (
            <span className="fs-stepper__active-label">{activeLabel}</span>
          )}
        </div>
        {variant === "progress" && (
          <div
            className="fs-stepper__progress"
            role="progressbar"
            aria-label="Form completion"
            aria-valuemin={1}
            aria-valuemax={stepCount}
            aria-valuenow={complete ? stepCount : activeStep + 1}
          >
            <span style={{ inlineSize: `${progress}%` }} />
          </div>
        )}
      </nav>
    );
  }

  return (
    <nav
      className={`fs-stepper fs-stepper--${variant}`}
      aria-label="Form progress"
    >
      {variant === "numbered" && (
        <div className="fs-stepper__mobile">
          <div className="fs-stepper__context">
            <span className="fs-stepper__count">
              {complete ? "Completed" : `Step ${activeStep + 1} of ${stepCount}`}
            </span>
            {!complete && activeLabel && (
              <span className="fs-stepper__active-label">{activeLabel}</span>
            )}
          </div>
          <div
            className="fs-stepper__progress"
            role="progressbar"
            aria-label="Form completion"
            aria-valuemin={1}
            aria-valuemax={stepCount}
            aria-valuenow={complete ? stepCount : activeStep + 1}
          >
            <span style={{ inlineSize: `${progress}%` }} />
          </div>
        </div>
      )}
      <ol className="fs-stepper__list">
      {React.Children.map(steps, (child, index) => {
        if (!React.isValidElement<FormikStepProps>(child)) return null;
        const { id, icon, label } = child.props;
        return (
          <Step
            key={id}
            label={label}
            active={!complete && activeStep === index}
            done={complete || activeStep > index}
            error={errorStep === index}
            blocked={blocked && activeStep === index}
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
      </ol>
    </nav>
  );
};

Stepper.displayName = "Stepper";

export default React.memo(Stepper, (prevProps, nextProps) => {
  return (
    prevProps.activeStep === nextProps.activeStep &&
    prevProps.errorStep === nextProps.errorStep &&
    prevProps.blocked === nextProps.blocked &&
    prevProps.complete === nextProps.complete &&
    prevProps.variant === nextProps.variant &&
    prevProps.steps === nextProps.steps
  );
});
