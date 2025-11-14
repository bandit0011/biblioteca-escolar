import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function LibroListPage({ admin = false }) {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLibros();
  }, []);

  const fetchLibros = async () => {
    try {
      const res = await api.get("/libros");
      setLibros(res.data);
    } catch (err) {
      console.error("Error cargando libros:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Cargando libros...</p>;

  return (
    <div>
      <h1>Libros Disponibles</h1>

      {admin && (
        <Link to="/admin/libros/crear">➕ Agregar Libro</Link>
      )}

      <ul>
        {libros.map(libro => (
          <li key={libro.id_libro}>
            {libro.titulo} — {libro.autor} —{" "}
            {libro.Categoria?.nombre ?? "Sin categoría"}

            {admin && (
              <>
                <Link to={`/admin/libros/editar/${libro.id_libro}`}>
                  Editar
                </Link>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
