import React from "react";
import { FormikStepProps } from "./types";

const FormikStep = ({
  children,
  style,
}: React.PropsWithChildren<FormikStepProps>) => {
  return (
    <div style={style}>
      {React.Children.toArray(children).map((child, index) => {
        if (!React.isValidElement(child)) return null;
        return React.cloneElement(child, { key: `formikStep-key-${index}` });
      })}
    </div>
  );
};

export default React.memo(FormikStep);
