import React, { useCallback, useId } from "react";
import classNames from "classnames";
import { useField, useFormikContext } from "formik";
import { RadioFieldProps } from "../../types.ts";
import {
  describedByIds,
  FieldFeedback,
} from "../FieldFeedback.tsx";

export const RadioField = React.memo(
  ({
    className,
    component,
    helperText,
    label,
    labelColor,
    options,
    style,
    ...props
  }: RadioFieldProps) => {
    const groupId = useId();
    const [field, meta] = useField({ name: props.name });
    const { setFieldValue } = useFormikContext();
    const showError = Boolean(meta.error && meta.touched);
    const errorId = `${groupId}-error`;
    const helperId = `${groupId}-helper`;
    const describedBy = describedByIds(
      props["aria-describedby"],
      helperId,
      helperText,
      errorId,
      showError,
    );

    const changeValue = useCallback(
      (value: unknown) => {
        void setFieldValue(field.name, value);
      },
      [field.name, setFieldValue],
    );

    if (typeof component === "function") {
      return component({ field, meta, label });
    }

    return (
      <fieldset
        className={classNames("fs-field", "fs-choice-field", className, {
          "fs-field--error": showError,
          "fs-field--disabled": props.disabled,
        })}
        style={style}
      >
        <legend className="fs-field__label" style={{ color: labelColor }}>
          {label}
          {props.required ? (
            <span className="fs-field__required" aria-hidden="true">*</span>
          ) : null}
        </legend>

        <div className="fs-choice-field__options">
          {options.map((option, index) => {
            const optionId = `${groupId}-option-${index}`;
            return (
              <label
                className={classNames("fs-choice-field__option", {
                  "fs-choice-field__option--disabled": option.disabled,
                })}
                htmlFor={optionId}
                key={`${index}-${String(option.value)}`}
              >
                <input
                  {...field}
                  {...props}
                  aria-describedby={describedBy}
                  aria-errormessage={showError ? errorId : undefined}
                  aria-invalid={showError || undefined}
                  checked={Object.is(field.value, option.value)}
                  disabled={props.disabled || option.disabled}
                  id={optionId}
                  onChange={() => changeValue(option.value)}
                  type="radio"
                  value={String(option.value)}
                />
                <span className="fs-choice-field__control" aria-hidden="true" />
                <span style={{ color: option.labelColor ?? labelColor }}>
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>

        <FieldFeedback
          error={meta.error}
          errorId={errorId}
          helperId={helperId}
          helperText={helperText}
          showError={showError}
        />
      </fieldset>
    );
  },
);

RadioField.displayName = "RadioField";

export default RadioField;
