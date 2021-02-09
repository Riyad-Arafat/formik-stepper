import React, { useEffect, useState } from "react";
import { useField, useFormikContext } from "formik";
import {
  FormFeedback,
  FormGroup,
  FormText,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
} from "reactstrap";
import { InputFieldProps } from "./types";
import "./styles.css";

export const InputField = ({
  label,
  placeholder,
  className,
  iconStart,
  icon,
  symbol,
  type,
  ...props
}: InputFieldProps) => {
  const [field, meta] = useField(props);
  const [showPassword, setShowPassword] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const { status } = useFormikContext();
  const { error, touched } = meta;
  const [errorText, setErrorText] = useState(
    error || (status && status[props.name]) || null
  );
  const hasError = !!error || !!(status && status[props.name]);

  useEffect(() => {
    setIsPassword(type === "password");
  }, [type]);
  useEffect(() => {
    if (error) {
      setErrorText(error || (status && status[props.name]));
    }
  }, [error, props.name, status]);

  const t = type;
  return (
    <FormGroup className="position-relative">
      <Label>{label}</Label>
      <InputGroup>
        <Input
          placeholder={placeholder ? placeholder : label}
          className={className ? className : "form-control"}
          type={isPassword && showPassword ? "text" : type ? type : "text"}
          {...field}
          {...props}
        />
        {iconStart ? (
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              {iconStart && (
                <i className={`${iconStart}`} aria-hidden="true"></i>
              )}
            </InputGroupText>
          </InputGroupAddon>
        ) : null}
        {icon || symbol ? (
          <InputGroupAddon addonType="append">
            <InputGroupText>
              {symbol && <span>{symbol}</span>}
              {icon && <i className={`${icon}`} aria-hidden="true"></i>}
            </InputGroupText>
          </InputGroupAddon>
        ) : null}
        {isPassword ? (
          <InputGroupAddon
            addonType="append"
            style={{ cursor: "pointer" }}
            onClick={() => setShowPassword(!showPassword)}
          >
            <InputGroupText>
              <i
                className={`fa fa-${showPassword ? "eye-slash" : "eye"}`}
                aria-hidden="true"
              ></i>
            </InputGroupText>
          </InputGroupAddon>
        ) : null}
      </InputGroup>
      {touched && hasError ? (
        <FormText color="danger">{errorText}</FormText>
      ) : null}
    </FormGroup>
  );
};
