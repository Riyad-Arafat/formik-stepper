import React, { useEffect, useState } from "react";
import { useField, useFormikContext } from "formik";
import { FormGroup, Label, FormText } from "reactstrap";
import Select from "react-select";
import { InputField } from "../InputField";
import { SelectFieldProps } from "../../types";

export const SelectField = ({
  label,
  value,
  name,
  options,
  placeholder,
  readOnly,
  className,
  labelColor,
  component,
  ...props
}: SelectFieldProps) => {
  const [field, meta] = useField({
    name,
    value,
  });

  const { status, setFieldValue } = useFormikContext();
  const { error, touched } = meta;
  const errorText =
    (touched && error) || (status && status[props.name]) || null;
  const hasError = (!!error && touched) || !!(status && status[props.name]);

  const [values, setValues] = useState<any[] | null>(null);

  const onChangeHanlder = (option: any) => {
    if (props.isMulti && option && option.length > 0) {
      let values: any[] = [];
      option.map((op: any) => (values = [...values, op.value]));
      setFieldValue(field.name, values);
    } else if (option && option.value) {
      setFieldValue(field.name, option.value);
    } else {
      setFieldValue(field.name, option);
    }
  };

  useEffect(() => {
    if (options) {
      let vals: any[] = [];
      options.find((option: { value: any }) => {
        if (props.isMulti && field.value !== null && field?.value?.length > 0) {
          if (Array.isArray(field.value))
            field.value.find((v: any) => {
              if (v === option.value) {
                return (vals = [...vals, option]);
              }
              return null;
            });
        }
        if (option.value === field.value) return (vals = [...vals, option]);
        return null;
      });
      setValues(vals);
    }
  }, [field.value, options, props.isMulti]);

  if (typeof component === "function") {
    return component({ field, meta, status, label });
  }

  if (readOnly) {
    return <InputField name={name} label={label} readOnly />;
  }
  return (
    <FormGroup className="select2-container">
      <Label for={name.replace(/\s/g, "-")} style={{ color: labelColor }}>
        {label}
      </Label>

      <Select
        id={name.replace(/\s/g, "-")}
        classNamePrefix="select-control"
        name={field.name}
        onBlur={field.onBlur}
        onChange={onChangeHanlder}
        options={options}
        value={values}
        placeholder={placeholder ? placeholder : "Select"}
        isClearable
        {...props}
      />

      {touched && hasError ? (
        <FormText color="danger">{errorText}</FormText>
      ) : null}
    </FormGroup>
  );
};
