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
import "./MultiStep.css"; // Assuming you have a CSS file for custom styles

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("The First Name field is required"),
  lastName: Yup.string().required("The Last Name field is required"),
  email: Yup.string()
    .email("Invalid email")
    .required("The email field is required"),
  password: Yup.string().required("The password field is required"),
  privacy: Yup.boolean().oneOf([true], "You must accept the privacy policy"),
  RadioField: Yup.string().required("The Radio Field field is required"),
  select: Yup.array().required("The Select Field field is required"),
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
      onSubmit={onSubmit}
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        privacy: false,
        select: [],
      }}
      validationSchema={validationSchema}
      withStepperLine
      nextButton={{
        label: "Next",
        style: {
          padding: "10px 20px",
          margin: "10px",
          border: "none",
          borderRadius: "4px",
          backgroundColor: "#007bff",
          color: "white",
          cursor: "pointer",
        },
      }}
      prevButton={{
        label: "Back",
        style: {
          padding: "10px 20px",
          margin: "10px",
          border: "none",
          borderRadius: "4px",
          backgroundColor: "#007bff",
          color: "white",
          cursor: "pointer",
        },
      }}
      submitButton={{
        label: "Submit",
        style: {
          padding: "10px 20px",
          margin: "10px",
          border: "none",
          borderRadius: "30px",
          backgroundColor: "green",
          color: "white",
          cursor: "pointer",
        },
      }}
    >
      <FormikStep
        label="Profile Info"
        icon={({ active, done }) => (
          <span
            style={{
              fontSize: "20px",
              color: active ? "#37bf5e" : "#ccc",
            }}
          >
            {done ? "✔" : "1"}
          </span>
        )}
      >
        <div className="form-group">
          <InputField
            name="firstName"
            label="First Name"
            floating
            type="text"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <InputField
            name="lastName"
            label="Last Name"
            floating
            type="text"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <SelectField
            label="Select"
            name="select"
            labelColor="#dc3545"
            placeholder="Select"
            isMulti
            options={[
              { value: "one", label: "One" },
              { value: "two", label: "Two" },
              { value: "three", label: "Three" },
            ]}
            className="form-control"
          />
        </div>
      </FormikStep>
      <FormikStep label="Login Info">
        <div className="form-group">
          <InputField
            name="email"
            label="Email"
            type="email"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <InputField
            name="password"
            label="Password"
            type="password"
            floating
            className="form-control"
          />
        </div>
        <div className="form-group">
          <CheckBoxField
            name="privacy"
            label="Privacy"
            className="form-check-input"
          />
        </div>
        <div className="form-group">
          <RadioField
            name="RadioField"
            label="Radio"
            labelColor="#000"
            options={[
              { label: "One", value: "one" },
              { label: "Two", value: "two" },
            ]}
            className="form-check-input"
          />
        </div>
      </FormikStep>
    </FormikStepper>
  );
};

export const MultiStepFormCode = `
import {
  FormikStepper,
  FormikStep,
  InputField,
  CheckBoxField,
  RadioField,
  SelectField,
  FormikHelpers,
} from "formik-stepper";
import "formik-stepper/dist/style.css";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("The First Name field is required"),
  lastName: Yup.string().required("The Last Name field is required"),
  email: Yup.string()
    .email("Invalid email")
    .required("The email field is required"),
  password: Yup.string().required("The password field is required"),
  privacy: Yup.boolean().oneOf([true], "You must accept the privacy policy"),
  RadioField: Yup.string().required("The Radio Field field is required"),
  select: Yup.array().required("The Select Field field is required"),
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
      onSubmit={onSubmit}
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        privacy: false,
        select: [],
      }}
      validationSchema={validationSchema}
      withStepperLine
      nextButton={{ label: "Step" }}
      prevButton={{ label: "Back" }}
    >
      <FormikStep
        label="Profile Info"
        icon={({ active, done }) => (
          <span
            style={{
              fontSize: "20px",
              color: active ? "#37bf5e" : "#ccc",
            }}
          >
            {done ? "✔" : "1"}
          </span>
        )}
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
          type="text"
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
              { value: "two", label: "two" },
              { value: "three", label: "three" },
            ]}
          />
        </div>
      </FormikStep>
      <FormikStep label="Login Info">
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
            { label: "two.", value: "two" },
          ]}
        />
      </FormikStep>
    </FormikStepper>
  );
};
`;
