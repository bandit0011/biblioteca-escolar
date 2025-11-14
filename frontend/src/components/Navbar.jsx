import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const cargarUsuario = () => {
      const datos = localStorage.getItem("usuario");

      console.log("📦 Navbar detecta usuario en localStorage:", datos);
      setUsuario(datos ? JSON.parse(datos) : null);
    };

    cargarUsuario();
    window.addEventListener("storage", cargarUsuario);
    return () => window.removeEventListener("storage", cargarUsuario);
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");

    setUsuario(null);

    window.dispatchEvent(new Event("storage"));
    window.location.href = "/login";
  };

  // 🔥 ESTE VA AQUÍ
  console.log("👀 Estado actual de usuario en Navbar:", usuario);

  return (
    <nav
      style={{
        display: "flex",
        padding: "10px",
        background: "#333",
        color: "white",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Link to="/" style={{ color: "white", marginRight: 20 }}>
          Inicio
        </Link>

        <Link to="/libros" style={{ color: "white", marginRight: 20 }}>
          Libros
        </Link>

        {usuario?.rol === "admin" && (
          <Link to="/admin" style={{ color: "white", marginRight: 20 }}>
            Admin
          </Link>
        )}
      </div>

      <div>
        {!usuario && (
          <Link to="/login" style={{ color: "white" }}>
            Iniciar sesión
          </Link>
        )}

        {usuario && (
          <>
            <span style={{ marginRight: 10 }}>
              👋 Hola, {usuario.nombre}
            </span>
            <button onClick={cerrarSesion}>Cerrar sesión</button>
          </>
        )}
      </div>
    </nav>
  );
}
