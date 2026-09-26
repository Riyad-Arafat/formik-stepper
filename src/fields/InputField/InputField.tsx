import React, { memo, useCallback, useId, useState } from "react";
import classNames from "classnames";
import { useField } from "formik";
import { InputFieldProps } from "../../types.ts";
import {
  describedByIds,
  FieldFeedback,
  FieldLabel,
} from "../FieldFeedback.tsx";

interface PropTypes extends InputFieldProps {
  type?: React.HTMLInputTypeAttribute;
  inline?: boolean;
  floating?: boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const InputField = memo(
  ({
    className,
    inline = false,
    floating = false,
    component,
    helperText,
    id,
    label,
    labelColor,
    placeholder,
    style,
    type = "text",
    ...props
  }: PropTypes) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [field, meta] = useField({ name: props.name });
    const [showPassword, setShowPassword] = useState(false);
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
    const isPassword = type === "password";

    const togglePassword = useCallback(
      () => setShowPassword((visible) => !visible),
      [],
    );

    if (typeof component === "function") {
      return component({ field, meta, label });
    }

    return (
      <div
        className={classNames("fs-field", "input_group", {
          "fs-field--error": showError,
          "fs-field--disabled": props.disabled,
          "fs-field--inline": inline && !floating,
          "fs-field--floating": floating,
        })}
        style={style}
      >
        <div className="fs-field__control-wrap">
          {!floating ? (
            <FieldLabel
              htmlFor={inputId}
              label={label}
              labelColor={labelColor}
              required={props.required}
            />
          ) : null}

          <div className="fs-field__input-wrap">
            <input
              {...field}
              {...props}
              aria-describedby={describedBy}
              aria-errormessage={showError ? errorId : undefined}
              aria-invalid={showError || undefined}
              className={classNames("fs-field__input", className, {
                floating__input: floating,
                has_error: showError,
              })}
              id={inputId}
              placeholder={
                floating
                  ? " "
                  : placeholder ??
                    (typeof label === "string" ? label : undefined)
              }
              type={isPassword && showPassword ? "text" : type}
            />

            {floating ? (
              <FieldLabel
                htmlFor={inputId}
                label={label}
                labelColor={labelColor}
                required={props.required}
              />
            ) : null}

            {isPassword ? (
              <button
                type="button"
                className="fs-field__password-toggle password_eye"
                onClick={togglePassword}
                aria-controls={inputId}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                disabled={props.disabled}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.75"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  {showPassword ? (
                    <>
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" />
                      <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c5.5 0 9 8 9 8a17.7 17.7 0 0 1-2.1 3.5" />
                      <path d="M6.6 6.6C4.2 8.3 3 12 3 12s3.5 8 9 8c1.3 0 2.5-.4 3.5-1" />
                    </>
                  ) : (
                    <>
                      <path d="M3 12s3.5-8 9-8 9 8 9 8-3.5 8-9 8-9-8-9-8z" />
                      <circle cx="12" cy="12" r="2.5" />
                    </>
                  )}
                </svg>
              </button>
            ) : null}
          </div>
        </div>

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

InputField.displayName = "InputField";

export default InputField;
