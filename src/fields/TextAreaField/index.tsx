import React, { memo, useId } from "react";
import classNames from "classnames";
import { useField } from "formik";
import type { ComponentProps, FieldProps } from "../../types.ts";
import {
  describedByIds,
  FieldControl,
  FieldFeedback,
} from "../FieldFeedback.tsx";

export type TextAreaFieldProps = FieldProps & {
  className?: string;
  component?: (props: ComponentProps) => React.JSX.Element;
  floating?: boolean;
  id?: string;
  maxLength?: number;
  minLength?: number;
  placeholder?: string;
  rows?: number;
  showCharacterCount?: boolean;
  style?: React.CSSProperties;
};

export const TextAreaField = memo(
  ({
    className,
    component,
    floating = false,
    helperText,
    id,
    label,
    labelColor,
    rows = 4,
    showCharacterCount = false,
    style,
    ...props
  }: TextAreaFieldProps) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [field, meta] = useField({ name: props.name });
    const showError = Boolean(meta.error && meta.touched);
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;
    const countId = `${inputId}-count`;
    const describedBy = [
      describedByIds(
        props["aria-describedby"],
        helperId,
        helperText,
        errorId,
        showError,
      ),
      showCharacterCount ? countId : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;
    const characterCount = String(field.value ?? "").length;

    if (typeof component === "function") {
      return component({ field, meta, label });
    }

    return (
      <div
        className={classNames("fs-field", "fs-textarea-field", "input_group", {
          "fs-field--error": showError,
          "fs-field--disabled": props.disabled,
          "fs-field--floating": floating,
        })}
        style={style}
      >
        <FieldControl floating={floating} htmlFor={inputId} label={label} labelColor={labelColor} required={props.required}>
            <textarea
              {...field}
              {...props}
              aria-describedby={describedBy}
              aria-errormessage={showError ? errorId : undefined}
              aria-invalid={showError || undefined}
              className={classNames("fs-field__input", className)}
              id={inputId}
              placeholder={floating ? " " : props.placeholder}
              rows={rows}
            />
        </FieldControl>
        <div className="fs-field__meta">
          <FieldFeedback
            error={meta.error}
            errorId={errorId}
            helperId={helperId}
            helperText={helperText}
            showError={showError}
          />
          {showCharacterCount ? (
            <span className="fs-field__count" id={countId}>
              {characterCount}
              {props.maxLength ? ` / ${props.maxLength}` : ""}
            </span>
          ) : null}
        </div>
      </div>
    );
  },
);

TextAreaField.displayName = "TextAreaField";

export default TextAreaField;
