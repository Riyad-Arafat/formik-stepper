import React, { memo } from "react";
import { FormikStepProps } from "./types";

export const FormikStep = memo(({ children }: FormikStepProps) => {
  return <React.Fragment>{children}</React.Fragment>;
});

export default FormikStep;
