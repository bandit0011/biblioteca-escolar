import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // Asegúrate que la ruta sea correcta

export default function Login() {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar error previo

    try {
      // 1. Llamar al API de login (que ahora está en /api/auth/login)
      const res = await api.post("/auth/login", { email, contrasena });

      // 2. Guardar los datos en localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("usuario", JSON.stringify(res.data.usuario));
      localStorage.setItem("rol", res.data.usuario.rol);

      // 3. Notificar a otros componentes (como Navbar) que el storage cambió
      window.dispatchEvent(new Event("storage"));

      // 4. Redirigir al dashboard
      navigate("/admin");

    } catch (err) {
      console.error("Error en el login:", err);
      setError(err.response?.data?.error || "Error al iniciar sesión");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
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

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}