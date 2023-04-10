import React, { memo, useId, useMemo } from "react";
import { useField } from "formik";

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

export const CheckBoxField = memo(
  ({ label, labelColor, component, style, ...props }: CheckBoxFieldProps) => {
    const Id = useId();
    const [field, meta] = useField(props);
    const { error, touched } = meta;
    const errorText = error || null;
    const hasError = !!error;

    const FieldComponent = useMemo(
      () => (
        <>
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
              <label htmlFor={Id} style={{ color: "#b50000", marginTop: 5 }}>
                {errorText}
              </label>
            ) : null}
          </div>
        </>
      ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [Id, errorText, hasError, label, labelColor, style, touched]
    );

    if (typeof component === "function") {
      return component({ field, meta, label });
    }

    return FieldComponent;
  }
);

export default CheckBoxField;
