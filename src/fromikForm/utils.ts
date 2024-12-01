import React from "react";
import { Validateprops } from "./types";

type Parent = Exclude<React.ReactNode, boolean | null | undefined>;

/**
 * Recursively retrieves the names of all valid React elements within a parent element.
 *
 * @param parent - The parent React node to extract names from.
 * @returns An array of names of the valid React elements.
 */
const getNames = (parent: Parent): string[] => {
  let names: string[] = [];
  if (React.isValidElement(parent)) {
    const childrenArray = React.Children.toArray(parent.props.children);

    if (parent.props.name) {
      return [parent.props.name];
    }

    if (childrenArray.length > 0) {
      childrenArray.forEach((child) => {
        const newNames = getNames(child as Parent);
        names = [...names, ...newNames];
      });
    }
  }
  return names;
};

/**
 * Validates the current step of a Formik form.
 *
 * @param errors - The errors object from Formik.
 * @param setTouched - The Formik setTouched function.
 * @param setFieldError - The Formik setFieldError function.
 * @param currentStep - The current step React element.
 * @returns A boolean indicating whether the current step is valid.
 */
export const validate = ({
  errors,
  setTouched,
  setFieldError,
  currentStep,
}: Validateprops): boolean => {
  if (errors && Object.keys(errors).length > 0) {
    let valid = true;
    const touchedFields: Record<string, any> = {};
    const names: string[] = getNames(currentStep);

    names.forEach((nameField) => {
      if (errors[nameField]) {
        valid = false;
        touchedFields[nameField] = errors[nameField];
      } else {
        setFieldError(nameField, "");
      }
    });

    if (valid) {
      setTouched({});
      return true;
    } else {
      setTouched(touchedFields);
      return false;
    }
  } else {
    setTouched({});
    return true;
  }
};
