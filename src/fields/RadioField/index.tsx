import React from "react";
import { useField, useFormikContext } from "formik";
import { FormGroup, FormText, Input, Label } from "reactstrap";
import { RadioFieldProps } from "../../types";

export const RadioField = ({
  label,
  labelColor,
  options,
  component,
  ...props
}: RadioFieldProps) => {
  const [field, meta] = useField(props);
  const { status, setFieldValue } = useFormikContext();
  const { error } = meta;
  const errorText = error || (status && status[props.name]) || null;
  const hasError = !!error || !!(status && status[props.name]);

  const onChangeHanlder = (value: any) => {
    setFieldValue(field.name, value);
  };

  if (typeof component === "function") {
    return component({ field, meta, status, label });
  }

  return (
    <FormGroup tag="fieldset">
      <Label style={{ color: labelColor }}>{label}</Label>
      {options.map((option, index) => (
        <FormGroup
          check
          disabled={option.disabled}
          key={index + "-" + option.value}
        >
          <Input
            id={option.value.replace(/\s/g, "-asas")}
            checked={field.value === option.value}
            type="radio"
            {...field}
            {...props}
            onChange={() => onChangeHanlder(option.value)}
          />
          <Label
            check
            style={{ color: labelColor }}
            for={option.value.replace(/\s/g, "-")}
          >
            {option.label}
          </Label>
        </FormGroup>
      ))}
      {hasError ? <FormText color="danger">{errorText}</FormText> : null}
    </FormGroup>
  );
};
