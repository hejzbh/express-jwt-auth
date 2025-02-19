import AuthForm from "../../components/AuthForm";

const RegisterPage = () => {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <h1 className="title">Create your account</h1>
      <AuthForm action="register" />
    </div>
  );
};

export default RegisterPage;
