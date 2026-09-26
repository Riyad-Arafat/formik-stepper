import React, { PropsWithChildren } from "react";
import { FormikStepProps } from "./types";

export const FormikStep: React.FC<PropsWithChildren<FormikStepProps>> =
  React.memo(({ children, style }) => <div style={style}>{children}</div>);

FormikStep.displayName = "FormikStep";

export default FormikStep;
