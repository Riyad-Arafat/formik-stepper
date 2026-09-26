import { useEffect } from "react";
import { FormikValues, useFormikContext } from "formik";
import { useStepper } from "./StepperContext";
import { StepperDraftAdapter } from "./types";

interface DraftPersistenceProps {
  adapter: StepperDraftAdapter;
}

export const DraftPersistence = ({ adapter }: DraftPersistenceProps) => {
  const { values } = useFormikContext<FormikValues>();
  const { activeStepId } = useStepper();

  useEffect(() => {
    adapter.save({ activeStepId, values });
  }, [activeStepId, adapter, values]);

  return null;
};
