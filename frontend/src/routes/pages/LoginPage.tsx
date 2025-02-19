import AuthForm from "../../components/AuthForm";

const LoginPage = () => {
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
      <h1 className="title">Login to your account</h1>
      <AuthForm action="login" />
    </div>
  );
};

export default LoginPage;
