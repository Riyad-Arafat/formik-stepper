import { FieldConfig, FieldHelperProps, FormikValues } from "formik";
import { InputType } from "reactstrap/es/Input";


export interface InputFieldProps extends FieldConfig<FormikValues>, FieldHelperProps<FormikValues> {
    label?: string
    placeholder?:string;
    className?:string;
    iconStart?:string;
    icon?:string; 
    symbol ?:string;
    type?:InputType
}

