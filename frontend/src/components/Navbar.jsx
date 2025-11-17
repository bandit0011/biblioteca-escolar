import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const [usuario, setUsuario] = useState(null);
  const { theme, setTheme } = useTheme();

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
    window.location.href = "/login"; // Redirige a login al cerrar sesión
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/">Inicio</Link>
        <Link to="/libros">Libros</Link>
        <Link to="/contacto">Contacto</Link>
        {/* --- ESTE ES EL ENLACE QUE PEDISTE --- */}
        {usuario && (
          <Link to="/perfil">Mi Perfil</Link>
        )}
        {/* --- FIN DEL BLOQUE AÑADIDO --- */}

        {usuario?.rol === "admin" && (
          <Link to="/admin">Admin</Link>
        )}
      </div>

      <div className="navbar-user">
        <select value={theme} onChange={(e) => setTheme(e.target.value)} style={{background: 'var(--color-input-bg)', color: 'var(--color-text)', border: 'none', borderRadius: '5px', padding: '5px'}}>
          <option value="system">Tema del Sistema</option>
          <option value="dark">Oscuro</option>
          <option value="light">Claro</option>
          <option value="high-contrast">Alto Contraste</option>
        </select>
        
        {!usuario && (
          <>
            <Link to="/registro" style={{ color: "white", textDecoration: 'none' }}>
              Registrarse
            </Link>
            <Link to="/login" style={{ color: "white", textDecoration: 'none' }}>
              Iniciar sesión
            </Link>
          </>
        )}

        {usuario && (
          <>
            <span>👋 Hola, {usuario.nombre}</span>
            <button onClick={cerrarSesion}>Cerrar sesión</button>
          </>
        )}
      </div>
    </nav>
  );
}