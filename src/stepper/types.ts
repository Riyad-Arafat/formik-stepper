import React from "react";
import { StepIndicatorVariant } from "../fromikForm/types";

export interface StepperProps {
  withNumbers?: boolean;
  icon?: ({ active, done }: { active: boolean; done: boolean }) => JSX.Element;
  circleColor?: `#${string}`;
  activeStep: number;
  errorStep?: number;
  blocked?: boolean;
  complete?: boolean;
  variant?: StepIndicatorVariant;
  steps?: Array<Exclude<React.ReactNode, boolean | null | undefined>>;
}

export interface StepProps extends React.PropsWithChildren {
  label?: React.ReactNode;
  icon?: React.ReactNode;
  active?: boolean;
  done?: boolean;
  error?: boolean;
  blocked?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}
