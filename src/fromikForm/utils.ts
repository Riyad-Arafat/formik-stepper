/// validation form

import React from "react";
import { Validateprops } from "./types";

////// GET All Fields Names which is in FormikStepper Component
type Parent = Exclude<React.ReactNode, boolean | null | undefined>;
const getNames = (parent: Parent) => {
  let names: string[] = [];
  if (React.isValidElement(parent)) {
    const childrenArray: Array<any> = React.Children.toArray(
      parent.props.children
    );

    if (parent.props.name) {
      return parent.props.name;
    }
    if (childrenArray && childrenArray.length > 0) {
      for (let i = 0; i < childrenArray.length; i++) {
        let newNames = getNames(childrenArray[i]);
        if (Array.isArray(newNames)) {
          names = [...names, ...newNames];
        } else {
          names = [...names, newNames];
        }
      }
      return names;
    }
  }
  return null;
};

/// If there is an error in any check field, you will be alerted with the danger color
export const validate = ({
  errors,
  setTouched,
  setFieldError,
  currentStep,
}: Validateprops): boolean => {
  if (errors && Object.keys(errors).length > 0) {
    let valid = true;
    let obj: any = {};
    let names: string[] = getNames(currentStep);
    for (let i = 0; i < names.length; i++) {
      const nameField = names[i];
      for (let key in errors) {
        if (key === nameField) {
          valid = false;
          obj[key] = errors[key];
        } else {
          setFieldError(key, "");
        }
      }
    }

    console.log({ valid, obj });
    if (valid) {
      setTouched({});
      return true;
    } else {
      setTouched(obj);
      return false;
    }
  } else {
    setTouched({});
    return true;
  }
};
