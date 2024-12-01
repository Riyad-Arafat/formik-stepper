import React, { useCallback, useMemo } from "react";
import { useField, useFormikContext } from "formik";
import { RadioFieldProps } from "../../types";

const initStyle = {
  height: "1em",
  width: "1em",
  marginInlineEnd: " 0.5em",
  marginTop: "0.25em",
  verticalAlign: "top",
};

export const RadioField = React.memo(
  ({
    label,
    labelColor,
    options,
    component,
    style,
    ...props
  }: RadioFieldProps) => {
    const [field, meta] = useField(props);
    const { setFieldValue } = useFormikContext();
    const { error, touched } = meta;
    const errorText = error || null;
    const hasError = !!error;

    const onChangeHanlder = useCallback(
      (value: any) => {
        setFieldValue(field.name, value);
      },
      [field.name, setFieldValue]
    );

    const FieldComponent = useMemo(
      () => (
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
          {hasError && touched ? (
            <label style={{ color: "#b50000", marginTop: 5 }}>
              {errorText}
            </label>
          ) : null}
        </div>
      ),
      [
        labelColor,
        label,
        options,
        hasError,
        touched,
        errorText,
        field,
        style,
        props,
        onChangeHanlder,
      ]
    );

    if (typeof component === "function") {
      return component({ field, meta, label });
    }

    return FieldComponent;
  }
);

RadioField.displayName = "RadioField";

export default RadioField;
