import { useField, useFormikContext } from "formik";
import React from "react";
import { FormGroup, FormText, Input, Label } from "reactstrap";

type Props = {
  name: string;
  label: string;
  labelColor?: `#${string}`;
  options: {
    label: string;
    value: any;
    disabled?: boolean;
    labelColor?: `#${string}`;
  }[];
};

export const RadioField = ({ label, labelColor, options, ...props }: Props) => {
  const [{ value, onChange, ...field }, meta] = useField(props);

  const { status, setFieldValue } = useFormikContext();

  const { error } = meta;
  const errorText = error || (status && status[props.name]) || null;
  const hasError = !!error || !!(status && status[props.name]);

  const onChangeHanlder = (value: any) => {
    setFieldValue(field.name, value);
  };
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
            type="radio"
            checked={value === option.value}
            onChange={() => onChangeHanlder(option.value)}
            {...props}
            {...field}
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
