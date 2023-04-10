import {
  FormikConfig,
  FormikErrors,
  FormikTouched,
  FormikValues,
} from "formik";
import React from "react";

export interface Validateprops {
  errors: FormikErrors<FormikValues>;
  setTouched: (
    touched: FormikTouched<FormikValues>,
    shouldValidate?: boolean
  ) => void;
  setFieldError: (field: string, message: string | undefined) => void;
  currentStep: Exclude<React.ReactNode, boolean | null | undefined>;
}

export interface FormikStepperProps extends FormikConfig<FormikValues> {
  withStepperLine?: boolean;
  nextButton?: ButtonProps;
  prevButton?: ButtonProps;
  submitButton?: ButtonProps;
  children: React.ReactNode;
}

export interface FormikButtonsProps {
  step: number;
  childrenLength: number;
  nextButton?: ButtonProps;
  prevButton?: ButtonProps;
  submitButton?: ButtonProps;
  setStep: (step: number) => void;
  currentStep: Exclude<React.ReactNode, boolean | null | undefined>;
}

type ButtonProps = {
  label?: string;
  style?: React.CSSProperties;
};

export interface FormikStepProps {
  label?: React.ReactNode;
  icon?: ({ active, done }: { active: boolean; done: boolean }) => JSX.Element;
  style?: React.CSSProperties;
}
