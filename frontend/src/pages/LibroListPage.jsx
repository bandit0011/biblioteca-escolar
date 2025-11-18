import { toast } from 'sonner';
import { useEffect, useState } from "react";
import api from "../api/axios";
import "./LibroListPage.css";
import { Link, useNavigate } from "react-router-dom";

export default function LibroListPage({ admin = false }) {
  // Estados de datos
  const [libros, setLibros] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de paginación y filtros
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // ... (Estados del Modal: showModal, libroSeleccionado, etc. SE MANTIENEN IGUAL) ...
  const [showModal, setShowModal] = useState(false);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [fechas, setFechas] = useState({
    inicio: new Date().toISOString().split('T')[0],
    fin: ""
  });
  
  const navigate = useNavigate();
  const usuarioLogueado = !!localStorage.getItem("token");

  // --- 1. CARGA DE DATOS (EFECTO PRINCIPAL) ---
  useEffect(() => {
    // Creamos un timer para "debounce" (esperar a que deje de escribir)
    const delaySearch = setTimeout(async () => {
      try {
        setLoading(true);
        // 2. Enviamos search y category al backend
        const [librosRes, categoriasRes] = await Promise.all([
          api.get(`/libros?page=${page}&limit=9&search=${searchTerm}&category=${selectedCategory}`),
          api.get("/categorias")
        ]);
        
        setLibros(librosRes.data.libros);
        setTotalPages(librosRes.data.totalPages);
        setCategorias(categoriasRes.data);

      } catch (err) {
        console.error("Error cargando datos:", err);
        toast.error("Error al cargar el catálogo");
      } finally {
        setLoading(false);
      }
    }, 300); // Espera 300ms antes de llamar a la API

    return () => clearTimeout(delaySearch); // Limpia el timer si escribe rápido
  }, [page, searchTerm, selectedCategory]); // <--- 3. Dependencias clave

  // ... (Funciones del Modal: abrirModalPrestamo, confirmarPrestamo SE MANTIENEN IGUAL) ...
  const abrirModalPrestamo = (libro) => {
      setLibroSeleccionado(libro);
      setShowModal(true);
  };
  const cerrarModal = () => {
      setShowModal(false);
      setLibroSeleccionado(null);
      setFechas({ ...fechas, fin: "" });
  };
  const confirmarPrestamo = async (e) => {
    e.preventDefault();
    if (!fechas.fin) return toast.error("Selecciona una fecha de devolución");
    try {
      await api.post("/prestamos", { 
        id_libro: libroSeleccionado.id_libro,
        fecha_prestamo: fechas.inicio,
        fecha_devolucion: fechas.fin
      });
      toast.success("¡Libro solicitado con éxito!");
      navigate("/perfil");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.mensaje || "Error al solicitar.");
    } finally {
      cerrarModal();
    }
  };

  // --- 4. ELIMINAMOS LA LÓGICA DE FILTRADO LOCAL ---
  // const librosFiltrados = libros.filter(...)  <--- ESTO SE BORRA
  // Ahora usamos directamente el estado "libros" porque ya viene filtrado del backend.

  // --- 5. MANEJADORES DE CAMBIOS ---
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Importante: Al buscar, volver a la página 1
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1); // Importante: Al filtrar, volver a la página 1
  };

  if (loading) {
     // ... (Tu código de Skeleton se mantiene igual) ...
     return (
      <div>
        <h1>Cargando catálogo...</h1>
        <div className="libros-grid">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="skeleton-card">
              <div className="skeleton-img"></div>
              <div className="skeleton-text"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>{admin ? "Gestionar Libros" : "Libros Disponibles"}</h1>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar por título o autor..."
        value={searchTerm}
        onChange={handleSearchChange} // <--- Usamos el nuevo handler
        style={{ /* ... tus estilos ... */ width: '100%', padding: '10px', marginBottom: '10px' }}
      />

      {/* Filtro de Categoría */}
      <select
        value={selectedCategory}
        onChange={handleCategoryChange} // <--- Usamos el nuevo handler
        style={{ /* ... tus estilos ... */ width: '100%', padding: '10px', marginBottom: '20px' }}
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

      {/* ... (Tu Modal se mantiene igual) ... */}
      {showModal && (
          <div className="modal-overlay">
             {/* ... contenido del modal ... */}
             <div className="modal-content">
                <h3>Pedir Prestado: {libroSeleccionado?.titulo}</h3>
                <form onSubmit={confirmarPrestamo}>
                   {/* ... inputs fechas ... */}
                   <div style={{marginBottom: '10px'}}>
                      <label>Devolución:</label>
                      <input type="date" onChange={e => setFechas({...fechas, fin: e.target.value})} required />
                   </div>
                   <button type="submit">Confirmar</button>
                   <button type="button" onClick={cerrarModal}>Cancelar</button>
                </form>
             </div>
          </div>
      )}

      {/* Grid de Libros */}
      <div className="libros-grid">
        {libros.length === 0 && (
            <p>No se encontraron libros que coincidan con la búsqueda.</p>
        )}

        {/* 6. RENDERIZAMOS "libros" DIRECTAMENTE (ya no librosFiltrados) */}
        {libros.map(libro => (
          <li key={libro.id_libro} className="libro-card">
            <img 
              src={libro.imagen_url || "https://i.imgur.com/sJ3CT4V.png"} 
              alt={`Portada de ${libro.titulo}`} 
              className="libro-card-imagen"
            />
            
            <div className="libro-card-info">
              <h3>{libro.titulo}</h3>
              <p><strong>Autor:</strong> {libro.autor}</p>
              <p><strong>Categoría:</strong> {libro.Categoria?.nombre ?? "Sin categoría"}</p>
              <p><strong>Disponibles:</strong> {libro.cantidad_disponible} / {libro.cantidad_total}</p>
            </div>

            <div className="libro-card-admin" style={{ justifyContent: 'center', paddingBottom: '15px' }}>
              {admin && (
                <Link to={`/admin/libros/editar/${libro.id_libro}`}>Editar</Link>
              )}
              {!admin && usuarioLogueado && (
                <button 
                  onClick={() => abrirModalPrestamo(libro)}
                  disabled={libro.cantidad_disponible === 0}
                  style={{ backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', cursor: 'pointer', width: '100%' }}
                >
                  {libro.cantidad_disponible > 0 ? "📅 Solicitar Préstamo" : "Agotado"}
                </button>
              )}
            </div>
          </li>
        ))}
      </div>

      {/* Controles de Paginación */}
      {libros.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px', marginBottom: '30px' }}>
          <button 
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            style={{ opacity: page === 1 ? 0.5 : 1 }}
          >
            ⬅️ Anterior
          </button>
          
          <span style={{ alignSelf: 'center' }}>Página {page} de {totalPages}</span>
          
          <button 
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            style={{ opacity: page === totalPages ? 0.5 : 1 }}
          >
            Siguiente ➡️
          </button>
        </div>
      )}
    </div>
  );
}