import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  // Solo verifica si está logueado, sin importar el rol
  if (!token) return <Navigate to="/login" />;

  return children;
}