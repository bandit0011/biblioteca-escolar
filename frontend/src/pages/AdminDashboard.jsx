import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const [libros, setLibros] = useState([]);

  const cargarLibros = () => {
    api
      .get("/libros")
      .then((res) => setLibros(res.data))
      .catch(() => alert("Error cargando libros"));
  };

  useEffect(() => {
    cargarLibros();
  }, []);

 return (
    <div style={{ padding: "20px" }}>
      <h1>Panel de Administración</h1>
      <Link to="/admin/libros/crear">➕ Agregar Libro</Link> {/* CORREGIDO: Ruta actualizada */}

      <h2 style={{ marginTop: "20px" }}>Lista de Libros</h2>

      {libros.map((l) => (
        <div key={l.id_libro} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <h3>{l.titulo}</h3>
          <p>{l.autor}</p>
          <Link to={`/admin/libros/editar/${l.id_libro}`}>✏ Editar</Link>
          {" | "}
          <button
            onClick={async () => {
              if (!window.confirm("¿Eliminar libro?")) return; // AÑADIDO: Confirmación de usuario
              await api.delete(`/libros/${l.id_libro}`);
              cargarLibros();
            }}
          >
            🗑 Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}