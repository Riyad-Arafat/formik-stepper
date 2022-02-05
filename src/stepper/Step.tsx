import React, { useEffect, useState } from "react";

import { StepProps } from "./types";
export const Step = ({
  label,
  active,
  isFirst,
  isLast,
  stepNumber,
  labelColor,
  circleColor,
  Icon,
}: StepProps) => {
  const [loading, setLoading] = useState(false);
  const [tColor, setTcolor] = useState("");
  const [crColor, setCrColor] = useState("");

  const [classNames, setClassNames] = useState("stepper-step");

  useEffect(() => {
    if (active) {
      setClassNames((prev) => prev + "  active-step");
    } else {
      setClassNames("stepper-step");
    }
    console.log(active);
  }, [active]);
  //// SET COLORS WHICH USER NEEDES
  useEffect(() => {
    if (!crColor && circleColor) {
      if (circleColor.startsWith("#")) {
        setCrColor(`${circleColor}`);
      } else {
        setCrColor(
          getComputedStyle(document.documentElement).getPropertyValue(
            `--${circleColor}`
          )
        );
      }
    }
    if (!tColor && labelColor) {
      if (labelColor.startsWith("#")) {
        setTcolor(`${labelColor}`);
      } else {
        setTcolor(
          getComputedStyle(document.documentElement).getPropertyValue(
            `--${labelColor}`
          )
        );
      }
    }
    if (crColor || tColor || !loading) {
      setLoading(true);
    }
  }, [circleColor, crColor, loading, tColor, labelColor]);

  return loading ? (
    <div className={classNames}>
      <div
        className="stepper-circle"
        style={{
          background: circleColor ? `${crColor}` : "",
          filter: !active ? `opacity(0.43)` : "none",
        }}
      >
        <span>
          {typeof Icon === "function" && Icon() !== null ? Icon() : stepNumber}
        </span>
      </div>
      <div
        className="stepper-title"
        style={{
          color: `${tColor}`,
          filter: !active ? `opacity(0.43)` : "none",
        }}
      >
        {label}
      </div>
      {!isFirst ? <div className="stepper-bar-left" /> : null}
      {!isLast ? <div className="stepper-bar-right" /> : null}
    </div>
  ) : null;
};
