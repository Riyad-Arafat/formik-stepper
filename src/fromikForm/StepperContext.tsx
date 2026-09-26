import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export interface StepperStep {
  id: string;
}

export interface StepperContextValue {
  activeStepId: string;
  activeStepIndex: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  steps: readonly StepperStep[];
  goToStep: (stepId: string) => void;
  goNext: () => void;
  goPrevious: () => void;
}

interface StepperProviderProps {
  children: React.ReactNode;
  steps: readonly StepperStep[];
  initialStepId?: string;
  activeStepId?: string;
  onStepChange?: (stepId: string) => void;
}

const StepperContext = createContext<StepperContextValue | null>(null);

export const StepperProvider = ({
  children,
  steps,
  initialStepId,
  activeStepId: controlledStepId,
  onStepChange,
}: StepperProviderProps) => {
  const firstStepId = steps[0]?.id;
  const [uncontrolledStepId, setUncontrolledStepId] = useState(
    initialStepId ?? firstStepId
  );
  const requestedStepId = controlledStepId ?? uncontrolledStepId;
  const activeStepIndex = steps.findIndex((step) => step.id === requestedStepId);
  const normalizedStepIndex = activeStepIndex === -1 ? 0 : activeStepIndex;
  const activeStepId = steps[normalizedStepIndex]?.id;

  if (!activeStepId) {
    throw new Error("FormikStepper requires at least one FormikStep.");
  }

  const goToStep = useCallback(
    (stepId: string) => {
      if (!steps.some((step) => step.id === stepId) || stepId === activeStepId) {
        return;
      }

      if (controlledStepId === undefined) {
        setUncontrolledStepId(stepId);
      }
      onStepChange?.(stepId);
    },
    [activeStepId, controlledStepId, onStepChange, steps]
  );

  const value = useMemo<StepperContextValue>(
    () => ({
      activeStepId,
      activeStepIndex: normalizedStepIndex,
      isFirstStep: normalizedStepIndex === 0,
      isLastStep: normalizedStepIndex === steps.length - 1,
      steps,
      goToStep,
      goNext: () => {
        const nextStep = steps[normalizedStepIndex + 1];
        if (nextStep) {
          goToStep(nextStep.id);
        }
      },
      goPrevious: () => {
        const previousStep = steps[normalizedStepIndex - 1];
        if (previousStep) {
          goToStep(previousStep.id);
        }
      },
    }),
    [activeStepId, goToStep, normalizedStepIndex, steps]
  );

  return <StepperContext.Provider value={value}>{children}</StepperContext.Provider>;
};

export const useStepper = (): StepperContextValue => {
  const context = useContext(StepperContext);

  if (!context) {
    throw new Error("useStepper must be used within a StepperProvider.");
  }

  return context;
};
