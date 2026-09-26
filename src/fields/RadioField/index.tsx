import React, { useCallback, useId, useMemo } from "react";
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
    const Id = useId();
    const [field, meta] = useField(props);
    const { setFieldValue } = useFormikContext();
    const { error, touched } = meta;
    const errorText = error || null;
    const hasError = !!error;
    const showError = hasError && touched;
    const errorId = `${Id}-error`;
    const describedBy = [props["aria-describedby"], showError && errorId]
      .filter(Boolean)
      .join(" ") || undefined;

    const onChangeHanlder = useCallback(
      (value: any) => {
        setFieldValue(field.name, value);
      },
      [field.name, setFieldValue]
    );

    const FieldComponent = useMemo(
      () => (
        <fieldset style={{ border: 0, margin: 0, padding: 0 }}>
          <legend style={{ color: labelColor }}>{label}</legend>
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
                aria-describedby={describedBy}
                aria-invalid={showError || undefined}
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
          {showError ? (
            <div id={errorId} className="input-error">
              {errorText}
            </div>
          ) : null}
        </fieldset>
      ),
      [
        labelColor,
        label,
        options,
        showError,
        errorId,
        describedBy,
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
