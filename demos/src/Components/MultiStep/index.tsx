import {
  FormikStepper,
  FormikStep,
  InputField,
  CheckBoxField,
  RadioField,
  SelectField,
  FormikHelpers,
} from "formik-stepper";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("The First Name field is required"),
  lastName: Yup.string().required("The First Name field is required"),
  email: Yup.string()
    .email("Invalid email")
    .required("The email field is required"),
  password: Yup.string().required("The password field is required"),
  privacy: Yup.boolean().oneOf([true], "You must accept the privacy policy"),
});

export const MultiStep = () => {
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
      validationSchema={validationSchema}
      withStepperLine /// false as default and If it is false, it hides stepper line
      nextButton={{ label: "Step" }}
      prevButton={{ label: "Back" }}
      // submitButton={{ label: "Done", style: { background: "blue" } }}
    >
      {/*  First Step */}
      <FormikStep
        label="Profile Info" /// The text label of Step
        labelColor="#37bf5e" /// css-colors => #fff
        circleColor="#37bf5e" /// css-colors => #fff
      >
        <InputField
          name="firstName"
          label="First Name"
          floating
          type="text"
          style={{ width: "98%" }}
        />
        <InputField
          name="lastName"
          label="Last Name"
          floating
          type="password"
          style={{ width: "98%" }}
        />

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
      </FormikStep>
      {/* Second Step */}
      <FormikStep label="Login Info" circleColor="#6f42c1">
        <InputField name="email" label="Email" type="email" />
        <InputField name="password" label="password" type="password" floating />
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

export const MultiStepFormCode = `
import * as Yup from "yup";
import {
  FormikStepper,
  FormikStep,
  InputField,
  CheckBoxField,
  RadioField,
  SelectField,
  FormikHelpers,
} from "formik-stepper";

export const MultiStep = () => {
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
      // submitButton={{ label: "Done", style: { background: "blue" } }}
    >
      {/*  First Step */}
      <FormikStep
        label="Profile Info" /// The text label of Step
        labelColor="#37bf5e" /// css-colors => #fff
        circleColor="#37bf5e" /// css-colors => #fff
      >
        <InputField
          name="firstName"
          label="First Name"
          floating
          type="text"
          style={{ width: "98%" }}
        />
        <InputField
          name="lastName"
          label="Last Name"
          floating
          type="password"
          style={{ width: "98%" }}
        />

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
      </FormikStep>
      {/* Second Step */}
      <FormikStep label="Login Info" circleColor="#6f42c1">
        <InputField name="email" label="Email" type="email" />
        <InputField name="password" label="password" type="password" floating />
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
