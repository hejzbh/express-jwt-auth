import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

type FormData = {
  email: string;
  password: string;
};
interface AuthFormProps {
  action: "login" | "register";
}
const AuthForm = ({ action }: AuthFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = useCallback(async (formData: FormData) => {
    try {
      const { email, password } = formData;

      // 1) Data is missing
      if (!email || !password) throw new Error("Data is missing");

      // 2) Password is incorrect (Someone can change min=8 property from element through inspect element)
      if (password.length < 8)
        throw new Error("Password should be at least 8 chars");
      if (password.length > 35)
        throw new Error("Password should be less than 35 chars");

      // 3) Make api call
      const response = await axiosInstance
        .post(`${process.env.REACT_APP_API_KEY!}/auth/${action}`, formData)
        .catch((res) => {
          throw new Error(res?.response?.data?.error);
        });

      // 4)
      if (!response.data) throw new Error("Something went wrong");

      navigate("/homepage");
    } catch (err: any) {
      alert(err.message);
    }
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData((formData) => ({
      ...formData,
      [e.target.name]: e.target.value,
    }));

  return (
    <form
      className="auth-form"
      onSubmit={(e) => {
        e.preventDefault(); // Prevent page from reloading
        handleSubmit(formData);
      }}
    >
      {/** E-Mail */}
      <input
        onChange={onInputChange}
        value={formData.email}
        type="email"
        name="email"
        placeholder="Enter your e-mail"
      />
      {/** Password */}
      <input
        onChange={onInputChange}
        value={formData.password}
        type="password"
        name="password"
        placeholder="Enter your password"
        min={8}
      />
      {/** Submit */}
      <button title="Click">
        {action === "login" ? "Log In" : "Register"}
      </button>

      {/** Redirect */}
      <Link
        to={action === "login" ? "/register" : "/login"}
        style={{ color: "white" }}
      >
        {action === "login"
          ? "If you have no account, register"
          : "If you already have account, login"}
      </Link>
    </form>
  );
};

export default AuthForm;
