import React from "react";
import { Input, Label } from "reactstrap";
import { InputFieldProps } from "./types";

export const CheckBox = ({
  label,
  placeholder,
  className,
  type,
  ...props
}: InputFieldProps) => {
  return (
    <React.Fragment>
      <Input
        style={{
          paddingBlockEnd: "1.25rem",
          paddingInlineStart: "1.25rem",
          paddingLeft: "0",
        }}
        placeholder={placeholder ? placeholder : label}
        className={className}
        type={type}
        {...props}
      />
      <Label className="form-check-label" check>
        {label}
      </Label>
    </React.Fragment>
  );
};
