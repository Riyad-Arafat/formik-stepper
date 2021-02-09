import {
  FormikConfig,
  FormikErrors,
  FormikTouched,
  FormikValues,
} from "formik";

export interface Validateprops {
  errors: FormikErrors<FormikValues>;
  setTouched: (
    touched: FormikTouched<FormikValues>,
    shouldValidate?: boolean
  ) => void;
}

export interface FormikStepperProps extends FormikConfig<FormikValues> {
  withStepperLine?: boolean;
  labelsColor?: string;
  nextBtnLabel?: string;
  prevBtnLabel?: string;
  submitBtnLabel?: string;
  nextBtnColor?: string;
  prevBtnColor?: string;
  submitBtnColor?: string;
}

export interface FormikButtonsProps {
  step: number;
  childrenLength: number;
  nextBtnLabel?: string;
  prevBtnLabel?: string;
  submitBtnLabel?: string;
  nextBtnColor?: string;
  prevBtnColor?: string;
  submitBtnColor?: string;
  setStep: (step: number) => void;
  validateForm: (values?: any) => Promise<FormikErrors<FormikValues>>;
  setTouched: (
    touched: FormikTouched<FormikValues>,
    shouldValidate?: boolean | undefined
  ) => void;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
  validate: ({ errors, setTouched }: Validateprops) => boolean;
}

export interface FormikStepProps {
  label?: string;
  labelColor?: string;
  withNumbers?: boolean;
  withIcons?: string;
  iconColor?: string;
  circleColor?: string;
  children: Array<JSX.Element> | JSX.Element;
}
