import { FieldInputProps, FieldMetaProps } from "formik";
import React from "react";

export type FieldProps = {
  [key: string]: any;
  name: string;
  label: React.ReactNode;
  labelColor?: `#${string}`;
  helperText?: React.ReactNode;
};

export type ComponentProps = {
  field: FieldInputProps<any>;
  meta: FieldMetaProps<any>;
  label: React.ReactNode;
};

export type InputFieldProps = {
  floating?: boolean;
  component?: (props: ComponentProps) => React.JSX.Element;
} & FieldProps;

export type RadioFieldProps = {
  component?: (props: ComponentProps) => React.JSX.Element;
  style?: React.CSSProperties;
  options: {
    label: string;
    value: any;
    disabled?: boolean;
    labelColor?: `#${string}`;
  }[];
} & FieldProps;

export type SelectFieldProps = {
  readOnly?: boolean;
  readonly?: boolean;
  isMulti?: boolean;
  options: any[];
  component?: (props: ComponentProps) => React.JSX.Element;
} & FieldProps;
