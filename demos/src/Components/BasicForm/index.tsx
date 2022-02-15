import {
  FormikStepper,
  FormikStep,
  InputField,
  CheckBoxField,
  RadioField,
  SelectField,
  FormikHelpers,
} from "formik-stepper";

export const BasicForm = () => {
  const onSubmit = async (
    values: any,
    { setSubmitting }: FormikHelpers<any>
  ) => {
    console.log(values);
  };

  return (
    <FormikStepper
      /// Accept all Formik props
      onSubmit={onSubmit} /// onSubmit Function
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        privacy: false,
      }}
      // validationSchema={{}}
      withStepperLine /// false as default and If it is false, it hides stepper line
      nextButton={{ label: "Step" }}
      prevButton={{ label: "Back" }}
      submitButton={{ label: "Submit", style: { background: "green" } }}
    >
      {/*  First Step */}
      <FormikStep
        label="Profile Info" /// The text label of Step
        labelColor="#37bf5e" /// css-colors => #fff
        circleColor="#37bf5e" /// css-colors => #fff
      >
        <InputField name="firstName" label="First Name" floating />
        <InputField name="lastName" label="Last Name" floating />

        <div>
          <SelectField
            label="select"
            name="select"
            labelColor="#dc3545"
            placeholder="select"
            isMulti
            options={[
              { value: "one", label: "one" },
              { value: "tow", label: "tow" },
              { value: "three", label: "three" },
            ]}
          />
        </div>

        <div>
          <CheckBoxField name="privacy" label="privacy" />
        </div>
        <RadioField
          name="RadioField"
          label="Radio"
          labelColor="#000"
          options={[
            { label: "one.", value: "one" },
            { label: "tow.", value: "tow" },
          ]}
        />
      </FormikStep>
    </FormikStepper>
  );
};

export const BasicFormCode = `
import {
  FormikStepper,
  FormikStep,
  InputField,
  CheckBoxField,
  RadioField,
  SelectField,
  FormikHelpers,
} from "../../dd";

export const BasicForm = () => {
  const onSubmit = async (
    values: any,
    { setSubmitting }: FormikHelpers<any>
  ) => {
    console.log(values);
  };

  return (
    <FormikStepper
      /// Accept all Formik props
      onSubmit={onSubmit} /// onSubmit Function
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        privacy: false,
      }}
      // validationSchema={{}}
      withStepperLine /// false as default and If it is false, it hides stepper line
      nextButton={{ label: "Step" }}
      prevButton={{ label: "Back" }}
      submitButton={{ label: "Submit", style: { background: "green" } }}
    >
      {/*  First Step */}
      <FormikStep
        label="Profile Info" /// The text label of Step
        labelColor="#37bf5e" /// css-colors => #fff
        circleColor="#37bf5e" /// css-colors => #fff
      >
        <InputField name="firstName" label="First Name" floating />
        <InputField name="lastName" label="Last Name" floating />

        <div>
          <SelectField
            label="select"
            name="select"
            labelColor="#dc3545"
            placeholder="select"
            isMulti
            options={[
              { value: "one", label: "one" },
              { value: "tow", label: "tow" },
              { value: "three", label: "three" },
            ]}
          />
        </div>

        <div>
          <CheckBoxField name="privacy" label="privacy" />
        </div>
        <RadioField
          name="RadioField"
          label="Radio"
          labelColor="#000"
          options={[
            { label: "one.", value: "one" },
            { label: "tow.", value: "tow" },
          ]}
        />
      </FormikStep>
    </FormikStepper>
  );
};
  

`;
