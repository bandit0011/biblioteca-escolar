import { useEffect, useState } from "react";
import api from "../api/axios";
import "./LibroListPage.css";
import { Link, useNavigate } from "react-router-dom";

export default function LibroListPage({ admin = false }) {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // --- 1. AÑADIR ESTADOS PARA CATEGORÍAS ---
  const [categorias, setCategorias] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // "" significa "Todas"

  const usuarioLogueado = !!localStorage.getItem("token");

  // --- 2. ACTUALIZAR EL USEEFFECT PARA CARGAR LIBROS Y CATEGORÍAS ---
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Hacemos ambas peticiones a la API al mismo tiempo
        const [librosRes, categoriasRes] = await Promise.all([
          api.get("/libros"),
          api.get("/categorias") // Traemos las categorías
        ]);
        
        setLibros(librosRes.data);
        setCategorias(categoriasRes.data); // Guardamos las categorías en el estado

      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []); // Se ejecuta solo una vez al montar el componente

  // (La función fetchLibros ya no es necesaria, se movió al useEffect)

  const handlePedirPrestamo = async (id_libro) => {
    // ... (esta función no cambia)
    if (!window.confirm("¿Seguro que deseas pedir este libro?")) return;
    try {
      await api.post("/prestamos", { id_libro });
      alert("¡Libro solicitado con éxito!");
      navigate("/perfil"); 
    } catch (error) {
      console.error("Error al pedir préstamo:", error);
      alert(error.response?.data?.mensaje || "No se pudo solicitar el libro.");
    }
  };

  // --- 3. ACTUALIZAR LA LÓGICA DE FILTRADO ---
  const librosFiltrados = libros.filter(libro => {
    // Lógica de búsqueda (igual que antes)
    const matchesSearchTerm = 
      libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      libro.autor.toLowerCase().includes(searchTerm.toLowerCase());

    // NUEVA lógica de categoría
    const matchesCategory = 
      selectedCategory === "" // Si es "Todas las categorías"
      ? true // No filtra, devuelve true
      : libro.categoria_id === parseInt(selectedCategory); // Compara el ID

    // Devuelve true solo si cumple AMBAS condiciones
    return matchesSearchTerm && matchesCategory;
  });

  if (loading) return <p>Cargando libros y categorías...</p>;

  return (
    <div>
      <h1>{admin ? "Gestionar Libros" : "Libros Disponibles"}</h1>

      {/* Input de búsqueda (existente) */}
      <input
        type="text"
        placeholder="Buscar por título o autor..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px', // Reducimos margen para el select
          borderRadius: '5px',
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-input-bg)',
          color: 'var(--color-text)',
          fontSize: '1em',
          boxSizing: 'border-box'
        }}
      />

      {/* --- 4. AÑADIR EL DROPDOWN (SELECT) DE CATEGORÍAS --- */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '20px',
          borderRadius: '5px',
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-input-bg)',
          color: 'var(--color-text)',
          fontSize: '1em',
          boxSizing: 'border-box'
        }}
      >
        <option value="">Todas las categorías</option>
        {categorias.map(cat => (
          <option key={cat.id_categoria} value={cat.id_categoria}>
            {cat.nombre}
          </option>
        ))}
      </select>


      {admin && (
        <Link to="/admin/libros/crear" className="admin-boton-crear">
          ➕ Agregar Libro
        </Link>
      )}

      <div className="libros-grid">
        {/* --- 5. ACTUALIZAR MENSAJE DE "NO HAY LIBROS" --- */}
        {librosFiltrados.length === 0 && (
            <p>
              {libros.length > 0 
                ? "No se encontraron libros que coincidan con los filtros." 
                : "No hay libros para mostrar."
              }
            </p>
        )}

        {librosFiltrados.map(libro => (
          // El resto de la tarjeta (card) no cambia
          <li key={libro.id_libro} className="libro-card">
            <img 
              src={libro.imagen_url || "https://i.imgur.com/sJ3CT4V.png"} 
              alt={`Portada de ${libro.titulo}`} 
              className="libro-card-imagen"
            />
            <div className="libro-card-admin">
              {admin && (
                <Link to={`/admin/libros/editar/${libro.id_libro}`}>
                  Editar
                </Link>
              )}
              
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
              </div>
            )}
          </li>
        ))}
      </div>
    </div>
  );
}