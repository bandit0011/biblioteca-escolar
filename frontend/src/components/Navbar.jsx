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

  // 1. Creamos una variable para identificar si es personal de la biblioteca
  const esPersonal = usuario?.rol === "admin" || usuario?.rol === "bibliotecario";

  return (
    <nav className="navbar">
      <div className="navbar-links">
        
        {/* 2. Lógica Condicional: */}
        
        {/* SI NO ES PERSONAL (es decir, es estudiante o visitante), ve Inicio y Libros */}
        {!esPersonal && (
          <>
            <Link to="/">Inicio</Link>
            <Link to="/libros">Libros</Link>
          </>
        )}

        {/* Enlace de Contacto visible para todos (o puedes ocultarlo también si quieres) */}
        <Link to="/contacto">Contacto</Link>

        {/* Mi Perfil visible para cualquier usuario logueado */}
        {usuario && (
          <Link to="/perfil">Mi Perfil</Link>
        )}

        {/* 3. SI ES PERSONAL, ve el Panel de Gestión (y no ve Inicio/Libros) */}
        {esPersonal && (
          <Link to="/admin" style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>
            ⚙️ Panel de Gestión
          </Link>
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
            {/* Muestra el rol para confirmar que funciona */}
            <span>👋 Hola, {usuario.nombre} ({usuario.rol})</span>
            <button onClick={cerrarSesion}>Cerrar sesión</button>
          </>
        )}
      </div>
    </nav>
  );
}