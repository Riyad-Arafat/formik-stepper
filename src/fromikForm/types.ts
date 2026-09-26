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

export type StepTransitionDirection = "next" | "previous";

export interface StepTransitionContext {
  direction: StepTransitionDirection;
  currentStepId: string;
  nextStepId: string;
  values: FormikValues;
}

/** Return false to stop navigation. Guards may perform asynchronous work. */
export type StepTransitionGuard = (
  context: StepTransitionContext
) => boolean | Promise<boolean>;

export interface StepValidationError {
  field: string;
  message: string;
}

export interface StepperDraft {
  activeStepId?: string;
  values: FormikValues;
}

/** An explicit persistence boundary; the library never writes browser storage by itself. */
export interface StepperDraftAdapter {
  load: () => StepperDraft | null;
  save: (draft: StepperDraft) => void;
}

export interface FormikStepperProps extends FormikConfig<FormikValues> {
  /** The step shown when the stepper is uncontrolled. Defaults to the first step. */
  initialStepId?: string;
  /** Controls the currently visible step. */
  activeStepId?: string;
  /** Called after a valid step navigation request. */
  onStepChange?: (stepId: string) => void;
  /** Runs after current-step validation and before forward navigation. */
  beforeNext?: StepTransitionGuard;
  /** Runs before backward navigation. */
  beforePrevious?: StepTransitionGuard;
  /** Selects a conditional forward destination. Returning undefined keeps sequential navigation. */
  nextStepId?: (values: FormikValues) => string | undefined;
  /** Restores and saves draft state through a consumer-provided adapter. */
  draftAdapter?: StepperDraftAdapter;
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
  goToStep: (stepId: string) => void;
  currentStep: Exclude<React.ReactNode, boolean | null | undefined>;
  currentStepId: string;
  targetNextStepId?: string;
  previousStepId?: string;
  beforeNext?: StepTransitionGuard;
  beforePrevious?: StepTransitionGuard;
  onValidationFailure?: (errors: StepValidationError[]) => void;
  onTransitionPendingChange?: (isPending: boolean) => void;
}

type ButtonProps = {
  label?: string;
  style?: React.CSSProperties;
};

export interface FormikStepProps {
  /** A stable identifier used for navigation, branching, and state restoration. */
  id: string;
  label?: React.ReactNode;
  icon?: ({ active, done }: { active: boolean; done: boolean }) => JSX.Element;
  style?: React.CSSProperties;
}
