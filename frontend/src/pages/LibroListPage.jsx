import { useEffect, useState } from "react";
import api from "../api/axios";
import "./LibroListPage.css";
import { Link, useNavigate } from "react-router-dom";

export default function LibroListPage({ admin = false }) {
  // Estados para datos
  const [libros, setLibros] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // --- NUEVOS ESTADOS PARA EL MODAL DE PRÉSTAMO ---
  const [showModal, setShowModal] = useState(false);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [fechas, setFechas] = useState({
    inicio: new Date().toISOString().split('T')[0], // Hoy por defecto
    fin: ""
  });

  const navigate = useNavigate();
  const usuarioLogueado = !!localStorage.getItem("token");

  // Carga inicial de datos
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [librosRes, categoriasRes] = await Promise.all([
          api.get("/libros"),
          api.get("/categorias")
        ]);
        
        setLibros(librosRes.data);
        setCategorias(categoriasRes.data);

      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // --- LÓGICA DEL MODAL ---

  // 1. Abre el modal y guarda qué libro se quiere pedir
  const abrirModalPrestamo = (libro) => {
    setLibroSeleccionado(libro);
    setShowModal(true);
  };

  // 2. Cierra el modal y limpia el formulario
  const cerrarModal = () => {
    setShowModal(false);
    setLibroSeleccionado(null);
    setFechas({ ...fechas, fin: "" }); // Reseteamos solo la fecha fin
  };

  // 3. Confirma el préstamo enviando las fechas a la API
  const confirmarPrestamo = async (e) => {
    e.preventDefault();
    if (!fechas.fin) return alert("Selecciona una fecha de devolución");

    try {
      await api.post("/prestamos", { 
        id_libro: libroSeleccionado.id_libro,
        fecha_prestamo: fechas.inicio,
        fecha_devolucion: fechas.fin
      });
      alert("¡Libro solicitado con éxito!");
      navigate("/perfil");
    } catch (error) {
      console.error("Error al pedir préstamo:", error);
      alert(error.response?.data?.mensaje || "No se pudo solicitar el libro.");
    } finally {
      cerrarModal();
    }
  };

  // --- LÓGICA DE FILTRADO ---
  const librosFiltrados = libros.filter(libro => {
    const matchesSearchTerm = 
      libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      libro.autor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = 
      selectedCategory === "" 
      ? true 
      : libro.categoria_id === parseInt(selectedCategory);

    return matchesSearchTerm && matchesCategory;
  });

  if (loading) return <p>Cargando libros y categorías...</p>;

  return (
    <div>
      <h1>{admin ? "Gestionar Libros" : "Libros Disponibles"}</h1>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar por título o autor..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          marginBottom: '10px',
          borderRadius: '5px',
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-input-bg)',
          color: 'var(--color-text)',
          fontSize: '1em',
          boxSizing: 'border-box'
        }}
      />

      {/* Filtro de Categoría */}
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

      {/* Botón Admin */}
      {admin && (
        <Link to="/admin/libros/crear" className="admin-boton-crear">
          ➕ Agregar Libro
        </Link>
      )}

      {/* --- MODAL (Solo se muestra si showModal es true) --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Pedir Prestado: {libroSeleccionado?.titulo}</h3>
            <p style={{ fontSize: '0.9em', marginBottom: '15px' }}>
              Selecciona el periodo del préstamo:
            </p>
            <form onSubmit={confirmarPrestamo}>
              <div style={{ marginBottom: '10px', textAlign: 'left' }}>
                <label>Fecha de Inicio:</label>
                <input 
                  type="date" 
                  value={fechas.inicio}
                  onChange={(e) => setFechas({...fechas, inicio: e.target.value})}
                  required
                />
              </div>
              <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                <label>Fecha de Devolución:</label>
                <input 
                  type="date" 
                  value={fechas.fin}
                  onChange={(e) => setFechas({...fechas, fin: e.target.value})}
                  min={fechas.inicio} // Impide seleccionar fecha anterior al inicio
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button type="submit">Confirmar</button>
                <button 
                  type="button" 
                  onClick={cerrarModal} 
                  style={{ backgroundColor: '#666' }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid de Libros */}
      <div className="libros-grid">
        {librosFiltrados.length === 0 && (
            <p>
              {libros.length > 0 
                ? "No se encontraron libros que coincidan con los filtros." 
                : "No hay libros para mostrar."
              }
            </p>
        )}

        {librosFiltrados.map(libro => (
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
              <p><strong>Año:</strong> {libro.anio_publicacion || "N/A"}</p>
              <p><strong>Disponibles:</strong> {libro.cantidad_disponible} / {libro.cantidad_total}</p>
            </div>

            <div className="libro-card-admin" style={{ justifyContent: 'center', paddingBottom: '15px' }}>
              {/* Botón EDITAR para Admin */}
              {admin && (
                <Link to={`/admin/libros/editar/${libro.id_libro}`}>
                  Editar
                </Link>
              )}
              
              {/* Botón PEDIR para Estudiante */}
              {!admin && usuarioLogueado && (
                <button 
                  onClick={() => abrirModalPrestamo(libro)} // <-- LLAMA AL MODAL
                  disabled={libro.cantidad_disponible === 0}
                  style={{
                    backgroundColor: 'var(--color-primary)', 
                    color: 'white', 
                    border: 'none', 
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  {libro.cantidad_disponible > 0 ? "📅 Solicitar Préstamo" : "Agotado"}
                </button>
              )}
            </div>
          </li>
        ))}
      </div>
    </div>
  );
}