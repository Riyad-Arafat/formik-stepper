import React, { useEffect, useState } from "react";

import { StepProps } from "./types";
export const Step = ({
  active,
  done,
  isFirst,
  isLast,
  stepNumber,
  iconColor,
  labelColor,
  children,
  circleColor,
  withIcons,
  withNumbers,
}: StepProps) => {
  const [loading, setLoading] = useState(false);
  const [iColor, setIcolor] = useState("");
  const [tColor, setTcolor] = useState("");
  const [crColor, setCrColor] = useState("");

  let classNames = "stepper-step";
  if (done) {
    classNames += " step-done";
  }

  if (active) {
    classNames += " active-step";
  }

  //// SET COLORS WHICH USER NEEDES
  useEffect(() => {
    if (!iColor && iconColor) {
      if (iconColor.startsWith("#")) {
        setIcolor(`${iconColor}`);
      } else {
        setIcolor(
          getComputedStyle(document.documentElement).getPropertyValue(
            `--${iconColor}`
          )
        );
      }
    }
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
    if (crColor || iColor || tColor || !loading) {
      setLoading(true);
    }
  }, [circleColor, crColor, iColor, iconColor, loading, tColor, labelColor]);

  return loading ? (
    <div className={classNames}>
      <div
        className="stepper-circle"
        style={{
          background: circleColor ? `${crColor}` : "",
          color: iconColor ? `${iColor}` : "",
          filter: !active ? `opacity(0.43)` : "none",
        }}
      >
        <span>
          {withNumbers && stepNumber ? (
            stepNumber
          ) : withIcons ? (
            <i className={`${withIcons}`} />
          ) : (
            stepNumber
          )}
        </span>
      </div>
      <div
        className="stepper-title"
        style={{
          color: `${tColor}`,
          filter: !active ? `opacity(0.43)` : "none",
        }}
      >
        {children}
      </div>
      {!isFirst ? <div className="stepper-bar-left" /> : null}
      {!isLast ? <div className="stepper-bar-right" /> : null}
    </div>
  ) : null;
};
