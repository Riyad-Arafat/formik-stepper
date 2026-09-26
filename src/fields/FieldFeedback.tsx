import React from "react";

interface FieldFeedbackProps {
  error?: React.ReactNode;
  errorId: string;
  helperId: string;
  helperText?: React.ReactNode;
  showError: boolean;
}

export const describedByIds = (
  externalId: unknown,
  helperId: string,
  helperText: React.ReactNode,
  errorId: string,
  showError: boolean,
) =>
  [
    typeof externalId === "string" ? externalId : undefined,
    helperText ? helperId : undefined,
    showError ? errorId : undefined,
  ]
    .filter(Boolean)
    .join(" ") || undefined;

export const FieldFeedback = ({
  error,
  errorId,
  helperId,
  helperText,
  showError,
}: FieldFeedbackProps) => (
  <>
    {helperText ? (
      <div className="fs-field__helper" id={helperId}>
        {helperText}
      </div>
    ) : null}
    {showError ? (
      <div className="fs-field__error input-error" id={errorId} role="alert">
        {error}
      </div>
    ) : null}
  </>
);

interface FieldLabelProps {
  htmlFor?: string;
  label: React.ReactNode;
  labelColor?: string;
  required?: boolean;
}

export const FieldLabel = ({
  htmlFor,
  label,
  labelColor,
  required,
}: FieldLabelProps) => (
  <label className="fs-field__label" htmlFor={htmlFor} style={{ color: labelColor }}>
    <span>{label}</span>
    {required ? (
      <span className="fs-field__required" aria-hidden="true">
        *
      </span>
    ) : null}
  </label>
);

interface FieldControlProps extends FieldLabelProps {
  children: React.ReactNode;
  floating?: boolean;
}

export const FieldControl = ({
  children,
  floating,
  ...labelProps
}: FieldControlProps) => (
  <div className="fs-field__control-wrap">
    {!floating ? <FieldLabel {...labelProps} /> : null}
    <div className="fs-field__input-wrap">
      {children}
      {floating ? <FieldLabel {...labelProps} /> : null}
    </div>
  </div>
);
