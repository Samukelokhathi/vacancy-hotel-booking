import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

export default function ProtectedRoute() {
  const { isAuthenticated, authChecked } = useSelector(
    (state: RootState) => state.login,
  );

  // wait until the token check finishes, or a refresh would flash /login
  if (!authChecked) return <p>Loading...</p>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
