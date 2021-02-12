import React from "react";
import { FormikStepProps } from "./types";

export const FormikStep = ({
  children,
  label,
  withIcons,
  withNumbers,
  iconColor,
  circleColor,
  ...props
}: FormikStepProps) => {
  return <React.Fragment>{children}</React.Fragment>;
};
