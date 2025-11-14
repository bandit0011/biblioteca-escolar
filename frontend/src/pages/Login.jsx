import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // <-- 1. Importa Link
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      const res = await api.post("/auth/login", { email, contrasena });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("usuario", JSON.stringify(res.data.usuario));
      localStorage.setItem("rol", res.data.usuario.rol);
      window.dispatchEvent(new Event("storage"));
      
      // Si es admin, va al dashboard, si no, al perfil
      if (res.data.usuario.rol === "admin" || res.data.usuario.rol === "bibliotecario") {
        navigate("/admin");
      } else {
        navigate("/perfil");
      }

    } catch (err) {
      console.error("Error en el login:", err);
      setError(err.response?.data?.error || "Error al iniciar sesión");
    }
  };

  return (
    // 2. Envuelve todo en un 'div' para centrar el enlace
    <div style={{ textAlign: 'center' }}> 
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Contraseña:</label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: "15px" }}>
          Entrar
        </button>

        {error && <p style={{ color: "var(--color-danger)" }}>{error}</p>}
      </form>

      {/* 3. AÑADE ESTE BLOQUE */}
      <p style={{ marginTop: '20px' }}>
        ¿No tienes una cuenta?{' '}
        <Link to="/registro" style={{ color: 'var(--color-primary)' }}>
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}