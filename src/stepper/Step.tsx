import React from "react";
import { StepProps } from "./types";

const Step: React.FC<StepProps> = ({
  label,
  active,
  isFirst,
  isLast,
  icon,
}) => {
  return (
    <div className={`stepper-step ${active ? "active-step" : ""}`}>
      <div
        className="stepper-circle"
        style={{
          filter: !active ? `opacity(0.43)` : "none",
        }}
      >
        <span>{icon}</span>
      </div>
      <div
        className="stepper-title"
        style={{
          filter: !active ? `opacity(0.43)` : "none",
        }}
      >
        {label}
      </div>
      {!isFirst && <div className="stepper-bar-left" />}
      {!isLast && <div className="stepper-bar-right" />}
    </div>
  );
};

Step.displayName = "Step";

export default React.memo(Step, (prevProps, nextProps) => {
  return prevProps.active === nextProps.active;
});
