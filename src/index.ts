// import "./style.css"; // fix CSS cannot be imported in ssr like next.js
import FormikStep from "./fromikForm/FormikStep";
import FormComponent from "./fromikForm/FormikStepper";
import { InputField, SelectField, RadioField, CheckBoxField } from "./fields";
export * from "./fields";
export type { FormikHelpers } from "formik";
export type {
  FormikButtonsProps,
  FormikStepProps,
  FormikStepperProps,
} from "./fromikForm/types";

type CompoundedComponent = typeof FormComponent & {
  Step: typeof FormikStep;
  InputField: typeof InputField;
  SelectField: typeof SelectField;
  RadioField: typeof RadioField;
  CheckBoxField: typeof CheckBoxField;
};

const FormikStepper = FormComponent as CompoundedComponent;

FormikStepper.Step = FormikStep;
FormikStepper.InputField = InputField;
FormikStepper.SelectField = SelectField;
FormikStepper.RadioField = RadioField;
FormikStepper.CheckBoxField = CheckBoxField;

export { FormikStepper };

export default FormikStepper;
