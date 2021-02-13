import React from "react";
import { FormikStepProps } from "./types";

export const FormikStep = ({ children, ...props }: FormikStepProps) => {
  return <React.Fragment>{children}</React.Fragment>;
};
