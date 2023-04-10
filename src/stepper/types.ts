import React from "react";

export interface StepperProps {
  withNumbers?: boolean;
  icon?: ({ active, done }: { active: boolean; done: boolean }) => JSX.Element;
  circleColor?: `#${string}`;
  activeStep: number;
  steps?: Array<Exclude<React.ReactNode, boolean | null | undefined>>;
}

export interface StepProps extends React.PropsWithChildren {
  label?: React.ReactNode;
  icon?: React.ReactNode;
  active?: boolean;
  done?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}
