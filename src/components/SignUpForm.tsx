import { useState } from "react";

// 1. One state object for every field
const initialValues = {
  name: "",
  email: "",
  password: "",
};

type Field = keyof typeof initialValues;
type Errors = Partial<Record<Field, string>>;

// 3. One rule per field — returns an error message, or "" when valid
const validateField = (field: Field, value: string) => {
  switch (field) {
    case "name":
      if (!value.trim()) return "Name is required";
      if (value.trim().length < 2) return "Name must be at least 2 characters";
      return "";
    case "email":
      if (!value.trim()) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email";
      return "";
    case "password":
      if (!value) return "Password is required";
      if (value.length < 8) return "Password must be at least 8 characters";
      if (!/\d/.test(value)) return "Password must include a number";
      return "";
  }
};

const SignUpForm = () => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [submittedName, setSubmittedName] = useState("");

  // 2. One shared handler for every input, keyed by the input's name
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const field = e.target.name as Field;
    const value = e.target.value;

    setValues({ ...values, [field]: value });

    // Once a field is showing an error, re-check it as the user types
    // so the message clears the moment it's fixed
    if (errors[field]) {
      setErrors({ ...errors, [field]: validateField(field, value) });
    }
  };

  // 4. Validate when the user leaves a field and store the message
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const field = e.target.name as Field;
    setErrors({ ...errors, [field]: validateField(field, e.target.value) });
  };

  // 5. The form has errors if any field fails its rule
  const hasErrors = (Object.keys(values) as Field[]).some(
    (field) => validateField(field, values[field]) !== ""
  );

  // 6. Submit, then reset everything back to the start
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (hasErrors) return;

    setSubmittedName(values.name);
    setValues(initialValues);
    setErrors({});
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit} noValidate>
      <h2>Create an account</h2>

      <label>
        Name
        <input
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!errors.name}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </label>

      <label>
        Email
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!errors.email}
        />
        {errors.email && <span className="error">{errors.email}</span>}
      </label>

      <label>
        Password
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!errors.password}
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </label>

      <button type="submit" disabled={hasErrors}>
        Sign up
      </button>

      {submittedName && (
        <p className="success">Welcome aboard, {submittedName}!</p>
      )}
    </form>
  );
};

export default SignUpForm;
