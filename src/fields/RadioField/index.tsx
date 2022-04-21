import React from "react";
import { useField, useFormikContext } from "formik";
import { RadioFieldProps } from "../../types";

const initStyle = {
  height: "1em",
  width: "1em",
  marginInlineEnd: " 0.5em",
  marginTop: "0.25em",
  verticalAlign: "top",
};

export const RadioField = ({
  label,
  labelColor,
  options,
  component,
  style,
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
    <div>
      <label style={{ color: labelColor }}>{label}</label>
      {options.map((option, index) => (
        <div key={index + "-" + option.value}>
          <input
            type="radio"
            id={option.value.replace(/\s/g, "-")}
            checked={field.value === option.value}
            disabled={option.disabled}
            style={{ ...initStyle, ...style }}
            {...field}
            {...props}
            onChange={() => onChangeHanlder(option.value)}
          />
          <label
            htmlFor={option.value.replace(/\s/g, "-")}
            style={{ color: labelColor }}
          >
            {option.label}
          </label>
        </div>
      ))}
      {hasError ? (
        <label style={{ color: "#b50000" }}>{errorText}</label>
      ) : null}
    </div>
  );
};
