import { useEffect, useState } from "react";
import api from "../api/axios";
import "./LibroListPage.css"; // <-- 1. Importar el nuevo CSS
import { Link, useNavigate } from "react-router-dom"; // 1. Importar useNavigate

export default function LibroListPage({ admin = false }) {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 2. Inicializar navigate

  const usuarioLogueado = !!localStorage.getItem("token");

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

  const handlePedirPrestamo = async (id_libro) => {
    if (!window.confirm("¿Seguro que deseas pedir este libro?")) return;

    try {
      // (Opcional: podrías añadir un input para la fecha de devolución)
      await api.post("/prestamos", { id_libro });
      alert("¡Libro solicitado con éxito!");
      navigate("/perfil"); // Redirige al perfil para ver el préstamo
    } catch (error) {
      console.error("Error al pedir préstamo:", error);
      alert(error.response?.data?.mensaje || "No se pudo solicitar el libro.");
    }
  };

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
            <div className="libro-card-admin">
              {admin && (
                <Link to={`/admin/libros/editar/${libro.id_libro}`}>
                  Editar
                </Link>
              )}
              
              {/* Si NO es admin Y está logueado */}
              {!admin && usuarioLogueado && (
                <button 
                  onClick={() => handlePedirPrestamo(libro.id_libro)}
                  disabled={libro.cantidad_disponible === 0}
                  style={{
                    backgroundColor: 'var(--color-primary)', 
                    color: 'white', 
                    border: 'none', 
                    cursor: 'pointer'
                  }}
                >
                  {libro.cantidad_disponible > 0 ? "Pedir Prestado" : "Agotado"}
                </button>
              )}
            </div>
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