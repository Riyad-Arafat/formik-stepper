import React, { memo, useCallback, useId } from "react";
import classNames from "classnames";
import { useField, useFormikContext } from "formik";
import type { ComponentProps, FieldProps } from "../../types.ts";
import {
  describedByIds,
  FieldControl,
  FieldFeedback,
} from "../FieldFeedback.tsx";

export type EmptyNumberValue = "" | null;

export type NumberFieldProps = FieldProps & {
  className?: string;
  component?: (props: ComponentProps) => React.JSX.Element;
  emptyValue?: EmptyNumberValue;
  floating?: boolean;
  id?: string;
  max?: number;
  min?: number;
  placeholder?: string;
  step?: number | "any";
  style?: React.CSSProperties;
};

export const NumberField = memo(
  ({
    className,
    component,
    emptyValue = "",
    floating = false,
    helperText,
    id,
    label,
    labelColor,
    style,
    ...props
  }: NumberFieldProps) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [field, meta] = useField({ name: props.name });
    const { setFieldValue } = useFormikContext();
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

    const changeValue = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const nextValue =
          event.currentTarget.value === "" || Number.isNaN(event.currentTarget.valueAsNumber)
            ? emptyValue
            : event.currentTarget.valueAsNumber;
        void setFieldValue(field.name, nextValue);
      },
      [emptyValue, field.name, setFieldValue],
    );

    if (typeof component === "function") {
      return component({ field, meta, label });
    }

    return (
      <div
        className={classNames("fs-field", "fs-number-field", "input_group", {
          "fs-field--error": showError,
          "fs-field--disabled": props.disabled,
          "fs-field--floating": floating,
        })}
        style={style}
      >
        <FieldControl floating={floating} htmlFor={inputId} label={label} labelColor={labelColor} required={props.required}>
            <input
              {...field}
              {...props}
              aria-describedby={describedBy}
              aria-errormessage={showError ? errorId : undefined}
              aria-invalid={showError || undefined}
              className={classNames("fs-field__input", className)}
              id={inputId}
              inputMode="decimal"
              onChange={changeValue}
              placeholder={floating ? " " : props.placeholder}
              type="number"
              value={field.value ?? ""}
            />
        </FieldControl>
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

NumberField.displayName = "NumberField";

export default NumberField;
