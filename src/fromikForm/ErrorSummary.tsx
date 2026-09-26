import React, { useEffect, useRef } from "react";
import { StepValidationError } from "./types";

interface ErrorSummaryProps {
  errors: StepValidationError[];
}

export const ErrorSummary = ({ errors }: ErrorSummaryProps) => {
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (errors.length > 0) summaryRef.current?.focus();
  }, [errors]);

  if (errors.length === 0) return null;

  return (
    <div ref={summaryRef} role="alert" tabIndex={-1} aria-labelledby="formik-stepper-errors">
      <h2 id="formik-stepper-errors">Please correct the highlighted fields</h2>
      <ul>
        {errors.map(({ field, message }) => (
          <li key={field}>{message}</li>
        ))}
      </ul>
    </div>
  );
};
