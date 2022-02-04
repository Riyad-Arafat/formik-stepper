import {
  FormikConfig,
  FormikErrors,
  FormikTouched,
  FormikValues,
} from "formik";
import { CSSProperties } from "react";

export interface Validateprops {
  errors: FormikErrors<FormikValues>;
  setTouched: (
    touched: FormikTouched<FormikValues>,
    shouldValidate?: boolean
  ) => void;
  setFieldError: (field: string, message: string | undefined) => void;
}

export interface FormikStepperProps extends FormikConfig<FormikValues> {
  withStepperLine?: boolean;
  labelsColor?: `#${string}`;
  nextButton?: ButtonProps;
  prevButton?: ButtonProps;
  submitButton?: ButtonProps;
}

export interface FormikButtonsProps {
  step: number;
  childrenLength: number;
  nextButton?: ButtonProps;
  prevButton?: ButtonProps;
  submitButton?: ButtonProps;
  setStep: (step: number) => void;
  validateForm: (values?: any) => Promise<FormikErrors<FormikValues>>;
  setTouched: (
    touched: FormikTouched<FormikValues>,
    shouldValidate?: boolean | undefined
  ) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  submitForm: (() => Promise<void>) & (() => Promise<any>);
  validate: ({ errors, setTouched }: Validateprops) => boolean;
  setFieldError: (field: string, message: string | undefined) => void;
}

type ButtonProps = {
  label?: string;
  style?: CSSProperties;
};

export interface FormikStepProps {
  label?: string;
  labelColor?: `#${string}`;
  withIcon?: string;
  iconColor?: `#${string}`;
  circleColor?: `#${string}`;
  children: Array<JSX.Element> | JSX.Element;
}
