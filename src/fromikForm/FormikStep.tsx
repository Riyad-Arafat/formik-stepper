import React, { PropsWithChildren } from "react";
import { FormikStepProps } from "./types";

export const FormikStep: React.FC<PropsWithChildren<FormikStepProps>> =
  React.memo(({ children, style }) => {
    return (
      <div style={style}>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, {
              key: `field-${index}-${Math.random()
                .toString(36)
                .substring(2, 9)}`,
            });
          }
          return null;
        })}
      </div>
    );
  });

FormikStep.displayName = "FormikStep";

export default FormikStep;
