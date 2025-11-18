import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./auth.jsx";

export default function ProtectedRoute() {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // or spinner
  if (!token) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
