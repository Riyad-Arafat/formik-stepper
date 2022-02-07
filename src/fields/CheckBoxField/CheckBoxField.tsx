import React from "react";
import { useField, useFormikContext } from "formik";
import { FormGroup, FormText, Input, Label } from "reactstrap";

import { ComponentProps, FieldProps } from "../../types";

type CheckBoxFieldProps = {
  component?: (props: ComponentProps) => JSX.Element;
} & FieldProps;

export const CheckBoxField = ({
  label,
  labelColor,
  component,
  ...props
}: CheckBoxFieldProps) => {
  const [field, meta] = useField(props);
  const { error, touched } = meta;
  const { status } = useFormikContext();

  const errorText = error || (status && status[props.name]) || null;
  const hasError = !!error || !!(status && status[props.name]);

  if (typeof component === "function") {
    return component({ field, meta, status, label });
  }

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
      {hasError && touched ? (
        <FormText color="danger">{errorText}</FormText>
      ) : null}
    </>
  );
};
