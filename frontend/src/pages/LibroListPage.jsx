import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import "./LibroListPage.css"; // <-- 1. Importar el nuevo CSS

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
      <h1>{admin ? "Gestionar Libros" : "Libros Disponibles"}</h1>

      {admin && (
        <Link to="/admin/libros/crear" className="admin-boton-crear">
          ➕ Agregar Libro
        </Link>
      )}

      {/* 2. Reemplazamos <ul> por <div className="libros-grid"> */}
      <div className="libros-grid">
        {libros.length === 0 && <p>No hay libros para mostrar.</p>}

        {libros.map(libro => (
          // 3. Cada <li> es ahora una "tarjeta"
          <li key={libro.id_libro} className="libro-card">
            <img 
              src={libro.imagen_url || "https://i.imgur.com/sJ3CT4V.png"} // URL de placeholder
              alt={`Portada de ${libro.titulo}`} 
              className="libro-card-imagen"
            />
            
            <div className="libro-card-info">
              <h3>{libro.titulo}</h3>
              <p><strong>Autor:</strong> {libro.autor}</p>
              <p><strong>Categoría:</strong> {libro.Categoria?.nombre ?? "Sin categoría"}</p>
              <p><strong>Año:</strong> {libro.anio_publicacion || "N/A"}</p>
              <p><strong>Disponibles:</strong> {libro.cantidad_disponible} / {libro.cantidad_total}</p>
            </div>
            
            {admin && (
              <div className="libro-card-admin">
                <Link to={`/admin/libros/editar/${libro.id_libro}`}>
                  Editar
                </Link>
                {/* Podrías añadir un botón de eliminar aquí si quisieras */}
              </div>
            )}
          </li>
        ))}
      </div>
    </div>
  );
}