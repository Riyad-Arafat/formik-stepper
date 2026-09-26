import React from "react";
import { StepProps } from "./types.ts";

const Step: React.FC<StepProps> = ({
  label,
  active,
  done,
  blocked,
  error,
  isFirst,
  isLast,
  icon,
}) => {
  const status = error
    ? "Error"
    : blocked
      ? "In progress"
      : active
        ? "Current"
        : done
          ? "Complete"
          : "Upcoming";

  return (
    <li
      className={`stepper-step ${active ? "active-step" : ""} ${
        error ? "error-step" : ""
      } ${blocked ? "blocked-step" : ""} ${done ? "complete-step" : ""}`}
      aria-current={active ? "step" : undefined}
    >
      <div className="stepper-circle" aria-hidden="true">
        <span>{icon}</span>
      </div>
      <div className="stepper-title">
        {label}
        <span className="fs-visually-hidden"> — {status}</span>
      </div>
      {!isFirst && <div className="stepper-bar-left" />}
      {!isLast && <div className="stepper-bar-right" />}
    </li>
  );
};

Step.displayName = "Step";

export default React.memo(Step, (prevProps, nextProps) => {
  return (
    prevProps.active === nextProps.active &&
    prevProps.done === nextProps.done &&
    prevProps.error === nextProps.error &&
    prevProps.blocked === nextProps.blocked &&
    prevProps.label === nextProps.label &&
    prevProps.icon === nextProps.icon &&
    prevProps.isFirst === nextProps.isFirst &&
    prevProps.isLast === nextProps.isLast
  );
});
