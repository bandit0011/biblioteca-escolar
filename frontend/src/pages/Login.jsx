import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Función para cargar usuario desde localStorage
    const cargarUsuario = () => {
      const datos = localStorage.getItem("usuario");

      console.log("📦 Navbar detecta en localStorage:", datos);

      if (datos) {
        const usuarioParseado = JSON.parse(datos);
        console.log("✅ Usuario parseado:", usuarioParseado);
        setUsuario(usuarioParseado);
      } else {
        console.log("❌ No hay usuario en localStorage");
        setUsuario(null);
      }
    };

    cargarUsuario();

    // Escuchar cambios manuales en localStorage
    window.addEventListener("storage", cargarUsuario);

    return () => window.removeEventListener("storage", cargarUsuario);
  }, []);

  const cerrarSesion = () => {
    console.log("🚪 Cerrando sesión...");

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");

    setUsuario(null);

    // Notificar cambio
    window.dispatchEvent(new Event("storage"));

    window.location.href = "/login";
  };

  console.log("👀 Estado actual usuario en Navbar:", usuario);

  return (
    <nav
      style={{
        display: "flex",
        padding: "10px",
        background: "#333",
        color: "white",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* IZQUIERDA */}
      <div>
        <Link to="/" style={{ color: "white", marginRight: 20 }}>
          Inicio
        </Link>

        <Link to="/libros" style={{ color: "white", marginRight: 20 }}>
          Libros
        </Link>

        {/* Solo ADMIN */}
        {usuario?.rol === "admin" && (
          <Link to="/admin" style={{ color: "white", marginRight: 20 }}>
            Admin
          </Link>
        )}
      </div>

      {/* DERECHA */}
      <div>
        {!usuario && (
          <Link to="/login" style={{ color: "white" }}>
            Iniciar sesión
          </Link>
        )}

        {usuario && (
          <>
            <span style={{ marginRight: 15 }}>
              👋 Hola, <strong>{usuario.nombre}</strong>
            </span>

            <button
              onClick={cerrarSesion}
              style={{
                padding: "5px 10px",
                background: "#ff4444",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
