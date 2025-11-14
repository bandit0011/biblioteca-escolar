import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol")?.trim().toLowerCase();

  if (!token) return <Navigate to="/login" />;

  // permitir admin o bibliotecario
  if (rol !== "admin" && rol !== "bibliotecario") {
    return <Navigate to="/login" />;
  }

  return children;
}
