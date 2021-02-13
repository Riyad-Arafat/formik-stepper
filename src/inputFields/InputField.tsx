import React, { useEffect, useState } from "react";
import { useField, useFormikContext } from "formik";
import { FormGroup, FormText } from "reactstrap";
import { InputFieldProps } from "./types";
import { CheckBox } from "./CheckBox";
import { TextInput } from "./TextInput";
import "./styles.min.css";

export const InputField = ({ type, ...props }: InputFieldProps) => {
  const [field, meta] = useField(props);

  const { status } = useFormikContext();
  const { error, touched } = meta;
  const [errorText, setErrorText] = useState(
    error || (status && status[props.name]) || null
  );

  useEffect(() => {
    if (error) {
      setErrorText(error || (status && status[props.name]));
    } else {
      setErrorText("");
    }
  }, [error, props.name, status]);

  return (
    <FormGroup className="position-relative" check={type === "checkbox"}>
      {type === "checkbox" ? (
        <CheckBox type={type} {...props} {...field} />
      ) : (
        <TextInput type={type} {...props} {...field} />
      )}
      {touched && errorText ? (
        <FormText color="danger">{errorText}</FormText>
      ) : null}
    </FormGroup>
  );
};
