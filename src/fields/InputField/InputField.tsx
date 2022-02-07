import React from "react";
import { useEffect, useState } from "react";
import { useField, useFormikContext } from "formik";
import {
  FormGroup,
  FormText,
  Input,
  InputGroup,
  InputGroupText,
  Label,
} from "reactstrap";
import { InputFieldProps } from "../../types";

export const InputField = ({
  label,
  floating = false,
  labelColor,
  component,
  ...props
}: InputFieldProps) => {
  const [field, meta] = useField({ name: props.name });
  const { status } = useFormikContext();
  const { error, touched } = meta;
  const errorText = error || (status && status[props.name]) || null;
  const hasError = !!error || !!(status && status[props.name]);
  const [showPassword, setShowPassword] = useState(false);
  const [isPassword, setIsPassword] = useState(false);

  const { placeholder, className, iconStart, icon, edge } = props;

  useEffect(() => {
    setIsPassword(props.type === "password");
  }, [props.type]);

  if (typeof component === "function") {
    return component({ field, meta, status, label });
  }

  if (floating) {
    return (
      <FormGroup floating className="position-relative">
        <Input
          id={label.replace(/\s/g, "-")}
          invalid={touched ? hasError : undefined}
          placeholder={placeholder ? placeholder : label}
          className={`form-control ${isPassword ? "pe-5" : ""} ${
            className ? className : ""
          }`}
          {...field}
          {...props}
          type={
            isPassword && showPassword
              ? props.type === "textarea"
                ? "textarea"
                : "text"
              : props.type
          }
          style={
            isPassword
              ? {
                  backgroundPosition: "right calc(0.375em + 1.9rem) center",
                  ...props.style,
                }
              : props.style
          }
        />
        <div className="position-absolute end-0 top-0 mt-3">
          {isPassword ? (
            <InputGroupText
              style={{ cursor: "pointer" }}
              className="py-0 border-0 bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i
                className={`font-size-20 bi bi-${
                  showPassword ? "eye-slash" : "eye"
                }`}
                aria-hidden="true"
              ></i>
            </InputGroupText>
          ) : null}
        </div>

        <Label for={label.replace(/\s/g, "-")} style={{ color: labelColor }}>
          {label}
        </Label>

        {touched && hasError ? (
          <FormText
            id={`error-${field.name}`}
            className="input-error"
            color="danger"
          >
            {errorText}
          </FormText>
        ) : null}
      </FormGroup>
    );
  }
  return (
    <>
      <FormGroup>
        <Label for={label.replace(/\s/g, "-")} style={{ color: labelColor }}>
          {label}
        </Label>

        <InputGroup>
          <Input
            id={label.replace(/\s/g, "-")}
            invalid={touched ? hasError : undefined}
            placeholder={placeholder ? placeholder : label}
            className={className ? className : "form-control"}
            {...field}
            {...props}
            type={
              isPassword && showPassword
                ? props.type === "textarea"
                  ? "textarea"
                  : "text"
                : props.type
            }
          />
          {iconStart ? (
            <InputGroupText>
              {iconStart && (
                <i className={`${iconStart}`} aria-hidden="true"></i>
              )}
            </InputGroupText>
          ) : null}
          {icon || edge ? (
            <InputGroupText>
              {edge && <span>{edge}</span>}
              {icon && <i className={`${icon}`} aria-hidden="true"></i>}
            </InputGroupText>
          ) : null}
          {isPassword ? (
            <InputGroupText
              style={{ cursor: "pointer" }}
              className=" py-0 "
              onClick={() => setShowPassword(!showPassword)}
            >
              <i
                className={`font-size-20 bi bi-${
                  showPassword ? "eye-slash" : "eye"
                }`}
                aria-hidden="true"
              ></i>
            </InputGroupText>
          ) : null}
        </InputGroup>
        {touched && hasError ? (
          <FormText
            id={`error-${field.name}`}
            className="input-error"
            color="danger"
          >
            {errorText}
          </FormText>
        ) : null}
      </FormGroup>
    </>
  );
};
