import { useField, useFormikContext } from "formik";
import React from "react";
import { FormGroup, FormText, Input, Label } from "reactstrap";

import { FieldProps } from "../../types";

export const CheckBoxField = ({ label, labelColor, ...props }: FieldProps) => {
  const [field, meta] = useField(props);

  const { status } = useFormikContext();

  const { error } = meta;
  const errorText = error || (status && status[props.name]) || null;
  const hasError = !!error || !!(status && status[props.name]);

  return (
    <>
      <FormGroup check>
        <Input
          id={label.replace(/\s/g, "-")}
          type="checkbox"
          {...props}
          {...field}
        />
        <Label
          for={label.replace(/\s/g, "-")}
          check
          style={{ color: labelColor }}
        >
          Check me out
        </Label>
      </FormGroup>
      {hasError ? <FormText color="danger">{errorText}</FormText> : null}
    </>
  );
};
