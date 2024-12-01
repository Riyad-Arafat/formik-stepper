import React, { memo, useEffect, useState } from "react";
import { useField, useFormikContext } from "formik";
import Select from "react-select";
import { InputField } from "../InputField";
import { SelectFieldProps } from "../../types";

type OptionType = {
  label: string;
  value: any;
};

export const SelectField = memo(
  ({
    label,
    value,
    name,
    options,
    placeholder,
    readOnly,
    className,
    labelColor,
    component,
    ...props
  }: SelectFieldProps) => {
    const [field, meta] = useField({
      name,
      value,
    });
    const { setFieldValue } = useFormikContext();
    const [values, setValues] = useState<any[]>([]);

    const onChangeHandler = (option: OptionType[] | OptionType) => {
      if (props.isMulti && Array.isArray(option)) {
        let values: any[] = [];
        option.forEach((op: any) => (values = [...values, op.value]));
        setFieldValue(field.name, values);
      } else if (!Array.isArray(option) && option.value) {
        setFieldValue(field.name, option.value);
      } else {
        setFieldValue(field.name, option);
      }
    };

    useEffect(() => {
      if (options) {
        let vals: any[] = [];
        options.find((option: { value: any }) => {
          if (
            props.isMulti &&
            field.value !== null &&
            field?.value?.length > 0
          ) {
            if (Array.isArray(field.value))
              field.value.find((v: any) => {
                if (v === option.value) {
                  return (vals = [...vals, option]);
                }
                return null;
              });
          }
          if (option.value === field.value) return (vals = [...vals, option]);
          return null;
        });
        setValues(vals);
      }
    }, [field.value, options, props.isMulti]);
    if (typeof component === "function") {
      return component({ field, meta, label });
    }

    if (readOnly) {
      return <InputField name={name} label={label} readOnly type="text" />;
    }
    return (
      <FieldComponent
        label={label}
        name={name}
        options={options}
        placeholder={placeholder}
        className={className}
        labelColor={labelColor}
        field={field}
        meta={meta}
        values={values}
        onChangeHandler={onChangeHandler}
        {...props}
      />
    );
  }
);

SelectField.displayName = "SelectField";

export default SelectField;

interface FieldComponentProps extends SelectFieldProps {
  field: any;
  meta: any;
  values?: any[];
  onChangeHandler: (option: OptionType[] | OptionType) => void;
}

const FieldComponent: React.FC<
  Omit<FieldComponentProps, "component" | "readOnly">
> = memo(
  ({
    label,
    name,
    options,
    placeholder,
    className,
    labelColor,
    field,
    meta,
    values,
    onChangeHandler,
    ...props
  }) => {
    const { error, touched } = meta;
    const errorText = (touched && error) || null;
    const hasError = !!error && touched;

    return (
      <div style={{ marginBottom: "2em" }}>
        <label htmlFor={name.replace(/\s/g, "-")} style={{ color: labelColor }}>
          {label}
        </label>

        <Select
          id={name.replace(/\s/g, "-")}
          classNamePrefix="select-control"
          options={options}
          placeholder={placeholder ? placeholder : "Select"}
          isClearable
          {...props}
          {...field}
          value={values}
          name={field.name}
          onBlur={field.onBlur}
          onChange={onChangeHandler}
          className={`${className} ${hasError && touched ? "has-error" : ""}`}
        />

        {touched && hasError ? (
          <label style={{ color: "#b50000" }}>{errorText}</label>
        ) : null}
      </div>
    );
  }
);

FieldComponent.displayName = "SelectFieldComponent";
