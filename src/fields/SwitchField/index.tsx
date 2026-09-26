import React, { memo, useId } from "react";
import classNames from "classnames";
import { useField } from "formik";
import type { ComponentProps, FieldProps } from "../../types.ts";
import {
  describedByIds,
  FieldFeedback,
} from "../FieldFeedback.tsx";

export type SwitchFieldProps = FieldProps & {
  className?: string;
  component?: (props: ComponentProps) => React.JSX.Element;
  id?: string;
  style?: React.CSSProperties;
};

export const SwitchField = memo(
  ({
    className,
    component,
    helperText,
    id,
    label,
    labelColor,
    style,
    ...props
  }: SwitchFieldProps) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [field, meta] = useField({ name: props.name, type: "checkbox" });
    const showError = Boolean(meta.error && meta.touched);
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;
    const describedBy = describedByIds(
      props["aria-describedby"],
      helperId,
      helperText,
      errorId,
      showError,
    );

    if (typeof component === "function") {
      return component({ field, meta, label });
    }

    return (
      <div
        className={classNames("fs-field", "fs-switch-field", className, {
          "fs-field--error": showError,
          "fs-field--disabled": props.disabled,
        })}
        style={style}
      >
        <label className="fs-switch-field__row" htmlFor={inputId}>
          <span className="fs-switch-field__copy">
            <span className="fs-field__label" style={{ color: labelColor }}>
              {label}
              {props.required ? (
                <span className="fs-field__required" aria-hidden="true">*</span>
              ) : null}
            </span>
          </span>
          <span className="fs-switch-field__control">
            <input
              {...field}
              {...props}
              aria-describedby={describedBy}
              aria-errormessage={showError ? errorId : undefined}
              aria-invalid={showError || undefined}
              checked={Boolean(field.value)}
              id={inputId}
              role="switch"
              type="checkbox"
            />
            <span className="fs-switch-field__track" aria-hidden="true">
              <span className="fs-switch-field__thumb" />
            </span>
          </span>
        </label>
        <FieldFeedback
          error={meta.error}
          errorId={errorId}
          helperId={helperId}
          helperText={helperText}
          showError={showError}
        />
      </div>
    );
  },
);

SwitchField.displayName = "SwitchField";

export default SwitchField;
