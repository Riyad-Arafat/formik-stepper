import React, { useState, useEffect } from "react";
import {
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
} from "reactstrap";
import { InputFieldProps } from "./types";

export const TextInput = ({
  label,
  placeholder,
  className,
  iconStart,
  icon,
  symbol,
  type,
  ...props
}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isPassword, setIsPassword] = useState(false);

  useEffect(() => {
    setIsPassword(type === "password");
  }, [type]);
  return (
    <React.Fragment>
      <Label>{label}</Label>
      <InputGroup>
        <Input
          placeholder={placeholder ? placeholder : label}
          className={className ? className : "form-control"}
          type={isPassword && showPassword ? "text" : type ? type : "text"}
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
                className={`bi ${
                  showPassword ? "bi-eye-slash-fill" : "bi bi-eye-fill"
                }`}
                aria-hidden="true"
              ></i>
            </InputGroupText>
          </InputGroupAddon>
        ) : null}
      </InputGroup>
    </React.Fragment>
  );
};
