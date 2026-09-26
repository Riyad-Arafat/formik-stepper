import React, { memo, useCallback, useId, useMemo } from "react";
import classNames from "classnames";
import { useField, useFormikContext } from "formik";
import Select, { MultiValue, SingleValue } from "react-select";
import { InputField } from "../InputField/index.ts";
import { SelectFieldProps } from "../../types.ts";
import {
  describedByIds,
  FieldControl,
  FieldFeedback,
} from "../FieldFeedback.tsx";

type OptionType = {
  label: string;
  value: any;
};

export const SelectField = memo(
  ({
    className,
    component,
    floating = false,
    helperText,
    id,
    label,
    labelColor,
    name,
    options,
    placeholder,
    readOnly,
    readonly,
    value,
    ...props
  }: SelectFieldProps) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [field, meta] = useField({ name, value });
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

    const selectedOptions = useMemo(() => {
      if (props.isMulti) {
        const selectedValues = Array.isArray(field.value) ? field.value : [];
        return options.filter((option: OptionType) =>
          selectedValues.some((selected) => Object.is(selected, option.value)),
        );
      }

      return (
        options.find((option: OptionType) =>
          Object.is(option.value, field.value),
        ) ?? null
      );
    }, [field.value, options, props.isMulti]);

    const changeValue = useCallback(
      (option: MultiValue<OptionType> | SingleValue<OptionType>) => {
        const nextValue = Array.isArray(option)
          ? option.map(({ value: optionValue }) => optionValue)
          : (option as SingleValue<OptionType>)?.value ?? null;
        void setFieldValue(field.name, nextValue);
      },
      [field.name, setFieldValue],
    );

    if (typeof component === "function") {
      return component({ field, meta, label });
    }

    if (readOnly ?? readonly) {
      const displayValue = Array.isArray(selectedOptions)
        ? selectedOptions.map((option) => option.label).join(", ")
        : selectedOptions?.label ?? "";
      return (
        <InputField
          floating={floating}
          name={name}
          label={label}
          helperText={helperText}
          readOnly
          type="text"
          value={displayValue}
        />
      );
    }

    return (
      <div
        className={classNames("fs-field", "fs-select-field", className, {
          "fs-field--error": showError,
          "fs-field--disabled": props.isDisabled,
          "fs-field--floating": floating,
          "fs-field--has-value": Array.isArray(selectedOptions)
            ? selectedOptions.length > 0
            : selectedOptions !== null,
        })}
      >
        <FieldControl floating={floating} htmlFor={inputId} label={label} labelColor={labelColor} required={props.required}>
            <Select<OptionType, boolean>
              {...props}
              aria-describedby={describedBy}
              aria-errormessage={showError ? errorId : undefined}
              aria-invalid={showError || undefined}
              classNamePrefix="fs-select"
              inputId={inputId}
              isClearable
              name={field.name}
              onBlur={field.onBlur}
              onChange={changeValue}
              options={options}
              placeholder={floating ? " " : placeholder ?? "Select an option"}
              value={selectedOptions}
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

SelectField.displayName = "SelectField";

export default SelectField;
