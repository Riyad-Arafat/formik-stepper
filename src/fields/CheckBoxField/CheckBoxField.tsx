import React, { memo, useId } from "react";
import classNames from "classnames";
import { useField } from "formik";
import { ComponentProps, FieldProps } from "../../types.ts";
import {
  describedByIds,
  FieldFeedback,
} from "../FieldFeedback.tsx";

type CheckBoxFieldProps = {
  component?: (props: ComponentProps) => React.JSX.Element;
  className?: string;
  style?: React.CSSProperties;
} & FieldProps;

export const CheckBoxField = memo(
  ({
    className,
    component,
    helperText,
    id,
    label,
    labelColor,
    style,
    ...props
  }: CheckBoxFieldProps) => {
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
        className={classNames("fs-field", "fs-choice-field", className, {
          "fs-field--error": showError,
          "fs-field--disabled": props.disabled,
        })}
        style={style}
      >
        <label className="fs-choice-field__option" htmlFor={inputId}>
          <input
            {...field}
            {...props}
            aria-describedby={describedBy}
            aria-errormessage={showError ? errorId : undefined}
            aria-invalid={showError || undefined}
            checked={Boolean(field.value)}
            id={inputId}
            type="checkbox"
          />
          <span className="fs-choice-field__control" aria-hidden="true" />
          <span style={{ color: labelColor }}>{label}</span>
          {props.required ? (
            <span className="fs-field__required" aria-hidden="true">*</span>
          ) : null}
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

CheckBoxField.displayName = "CheckBoxField";

export default CheckBoxField;
