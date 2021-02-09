export interface StepperProps {
  withNumbers?: boolean;
  withIcons?: boolean;
  iconColor?: string;
  circleColor?: string;
  activeStep?: number;
  children?: Array<JSX.Element> | JSX.Element;
}

export interface StepProps {
  withNumbers?: boolean;
  withIcons?: string | " ";
  active?: boolean;
  done?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  stepNumber?: number | null;
  labelColor?: string;
  iconColor?: string;
  circleColor?: string;
  children?: React.ReactNode;
}
