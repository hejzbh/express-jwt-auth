import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  type: "AUTHENTICATED" | "NOT_AUTHENTICATED" | "PUBLIC";
}

const ProtectedRoute = ({ type }: ProtectedRouteProps) => {
  const user = useAuth();

  if (type === "PUBLIC") {
    return <Outlet />;
  }

  if (
    (type === "AUTHENTICATED" && user) ||
    (type === "NOT_AUTHENTICATED" && !user)
  ) {
    return <Outlet />;
  }

  return <Navigate to={user ? "/homepage" : "/login"} />;
};

export default ProtectedRoute;
