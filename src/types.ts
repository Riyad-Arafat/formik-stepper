import { FieldInputProps, FieldMetaProps } from "formik";

export type FieldProps = {
  [key: string]: any;
  name: string;
  label: string;
  labelColor?: `#${string}`;
};

export type ComponentProps = {
  field: FieldInputProps<any>;
  meta: FieldMetaProps<any>;
  status: any;
  label: string;
};

export type InputFieldProps = {
  floating?: boolean;
  component?: (props: ComponentProps) => JSX.Element;
} & FieldProps;

export type RadioFieldProps = {
  component?: (props: ComponentProps) => JSX.Element;
  options: {
    label: string;
    value: any;
    disabled?: boolean;
    labelColor?: `#${string}`;
  }[];
} & FieldProps;

export type SelectFieldProps = {
  readonly?: boolean;
  isMulti?: boolean;
  options: any[];
  component?: (props: ComponentProps) => JSX.Element;
} & FieldProps;
