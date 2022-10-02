import React, { memo } from "react";
import { FormikStepProps } from "./types";

export const FormikStep = memo(({ children }: FormikStepProps) => {
  return (
    <React.Fragment>
      {React.Children.toArray(children).map((child, index) => {
        if (!React.isValidElement(child)) return null;
        return React.cloneElement(child, { key: `formikStep-key-${index}` });
      })}
    </React.Fragment>
  );
});

export default FormikStep;
