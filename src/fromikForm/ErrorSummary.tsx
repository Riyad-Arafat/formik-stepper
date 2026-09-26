import React, { useCallback, useEffect, useId, useRef } from "react";
import { StepValidationError } from "./types.ts";

interface ErrorSummaryProps {
  errors: StepValidationError[];
}

export const ErrorSummary = ({ errors }: ErrorSummaryProps) => {
  const summaryRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (errors.length > 0) summaryRef.current?.focus();
  }, [errors]);

  const focusField = useCallback((field: string) => {
    const target =
      document.getElementById(field) ??
      Array.from(document.getElementsByName(field)).find(
        (element): element is HTMLElement => element instanceof HTMLElement,
      );
    target?.focus();
  }, []);

  if (errors.length === 0) return null;

  return (
    <div
      className="fs-error-summary"
      ref={summaryRef}
      role="alert"
      tabIndex={-1}
      aria-labelledby={titleId}
    >
      <h2 className="fs-error-summary__title" id={titleId}>
        Please correct the highlighted fields
      </h2>
      <ul>
        {errors.map(({ field, message }) => (
          <li key={field}>
            <a
              href={`#${field}`}
              onClick={(event) => {
                event.preventDefault();
                focusField(field);
              }}
            >
              {message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
