import React from "react";
import { StepProps } from "./types";

const Step = ({ label, active, isFirst, isLast, icon }: StepProps) => {
  return (
    <div className={`stepper-step ${active ? "active-step" : ""}`}>
      <div
        className="stepper-circle"
        style={{
          filter: !active ? `opacity(0.43)` : "none",
        }}
      >
        <span>{React.cloneElement(<>{icon}</>)}</span>
      </div>
      <div
        className="stepper-title"
        style={{
          filter: !active ? `opacity(0.43)` : "none",
        }}
      >
        {React.cloneElement(<>{label}</>)}
      </div>
      {!isFirst && <div className="stepper-bar-left" />}
      {!isLast && <div className="stepper-bar-right" />}
    </div>
  );
};

export default React.memo(Step, (prevProps, nextProps) => {
  return prevProps.active === nextProps.active;
});
