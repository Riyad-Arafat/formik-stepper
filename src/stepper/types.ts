export interface StepperProps {
  withNumbers?: boolean;
  Icon?: boolean;
  circleColor?: `#${string}`;
  activeStep?: number;
  children?: Array<JSX.Element> | JSX.Element;
}

export interface StepProps {
  label?: string;
  Icon?: () => JSX.Element | null;
  active?: boolean;
  done?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  stepNumber?: number | null;
  labelColor?: `#${string}`;
  circleColor?: `#${string}`;
  children?: React.ReactNode;
}
