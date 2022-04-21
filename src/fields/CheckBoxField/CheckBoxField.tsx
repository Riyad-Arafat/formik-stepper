import React, { useId } from "react";
import { useField, useFormikContext } from "formik";

import { ComponentProps, FieldProps } from "../../types";

type CheckBoxFieldProps = {
  component?: (props: ComponentProps) => JSX.Element;
  style?: React.CSSProperties;
} & FieldProps;

const initStyle = {
  height: "1em",
  width: "1em",
  marginInlineEnd: " 0.5em",
  marginTop: "0.25em",
  verticalAlign: "top",
};

export const CheckBoxField = ({
  label,
  labelColor,
  component,
  style,
  ...props
}: CheckBoxFieldProps) => {
  const Id = useId();
  const [field, meta] = useField(props);
  const { error, touched } = meta;
  const { status } = useFormikContext();

  const errorText = error || (status && status[props.name]) || null;
  const hasError = !!error || !!(status && status[props.name]);

  if (typeof component === "function") {
    return component({ field, meta, status, label });
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginBottom: "1em",
      }}
    >
      <div>
        <input
          type="checkbox"
          id={Id}
          style={{
            ...initStyle,
            ...style,
          }}
          {...props}
          {...field}
        />
        <label htmlFor={Id} style={{ color: labelColor }}>
          {label}
        </label>
      </div>

      {hasError && touched ? (
        <label htmlFor={Id} style={{ color: "#b50000" }}>
          {errorText}
        </label>
      ) : null}
    </div>
  );
};
