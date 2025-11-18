import { toast } from 'sonner'; // <--- 1. IMPORTAR AL INICIO
import { useState, useEffect } from "react";
import api from "../api/axios";

// (Opcional) Puedes crear un PerfilPage.css similar a LibroListPage.css
// para estilizar las tarjetas de los libros prestados.

export default function PerfilPage() {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Obtenemos al usuario de localStorage
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const cargarMisPrestamos = () => { // 1. Mover la carga a su propia función
    api.get("/prestamos/mis-prestamos")
      .then(res => {
        setPrestamos(res.data);
      })
      .catch(err => {
        console.error("Error cargando mis préstamos:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    // Pedimos a la API la ruta que acabamos de crear
    api.get("/prestamos/mis-prestamos")
      .then(res => {
        setPrestamos(res.data);
      })
      .catch(err => {
        console.error("Error cargando mis préstamos:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // Se ejecuta solo una vez

  const handleDevolver = async (id_prestamo) => {
    if (!window.confirm("¿Seguro que deseas devolver este libro?")) return;

    try {
      console.log(`--- FE: Intentando devolver préstamo ID: ${id_prestamo} ---`);
      const res = await api.put(`/prestamos/${id_prestamo}/devolver`);
      
      const prestamoActualizado = res.data.prestamo;

      // +++ ESTE ES EL LOG MÁS IMPORTANTE DEL FRONTEND +++
      console.log("--- FE: Respuesta recibida del backend ---", prestamoActualizado);
      console.log(`--- FE: El estado recibido es: ${prestamoActualizado.estado} ---`);

      setPrestamos(prestamosActuales => 
        prestamosActuales.map(p => 
          p.id_prestamo === id_prestamo ? prestamoActualizado : p
        )
      );
      
      console.log("--- FE: Estado de React actualizado. El botón debería desaparecer. ---");
      toast.success("Libro devuelto con éxito");

    } catch (error) {
      console.error("--- FE: ❌ Error al devolver el libro ---", error.response?.data?.mensaje || error.message);
      toast.error(error.response?.data?.mensaje || "No se pudo devolver el libro.");
    }
  };

  return (
    <div>
      <h1>Mi Perfil</h1>
      {usuario && (
        <div style={{ background: 'var(--color-card-bg)', padding: '20px', borderRadius: '8px', maxWidth: '600px', margin: 'auto' }}>
          <p><strong>Nombre:</strong> {usuario.nombre}</p>
          <p><strong>Email:</strong> {usuario.email}</p>
          <p><strong>Rol:</strong> {usuario.rol}</p>
        </div>
      )}

      {usuario?.rol !== "bibliotecario" && (
        <>
          <h2 style={{ marginTop: '30px' }}>Mis Préstamos</h2>
          {loading && <p>Cargando tus préstamos...</p>}
          
          {!loading && prestamos.length === 0 && (
            <p>Aún no has pedido ningún libro.</p>
          )}

          <div className="libros-grid" style={{ marginTop: '20px' }}>
            {prestamos.map(prestamo => (
              <li key={prestamo.id_prestamo} className="libro-card">
                {/* ... contenido de la tarjeta del libro ... */}
                <img 
                    src={prestamo.Libro.imagen_url || "https://i.imgur.com/sJ3CT4V.png"}
                    alt={`Portada de ${prestamo.Libro.titulo}`} 
                    className="libro-card-imagen"
                  />
                  <div className="libro-card-info">
                    <h3>{prestamo.Libro.titulo}</h3>
                    <p><strong>Autor:</strong> {prestamo.Libro.autor}</p>
                    <p><strong>Fecha de Préstamo:</strong> {new Date(prestamo.fecha_prestamo).toLocaleDateString()}</p>
                    <p><strong>Estado:</strong> <span className={`status status-${prestamo.estado}`}>{prestamo.estado}</span></p>
                  </div>
                  
                  {prestamo.estado === 'aprobado' && (
                    <div className="libro-card-admin">
                        <button 
                          onClick={() => handleDevolver(prestamo.id_prestamo)}
                          style={{
                            backgroundColor: 'var(--color-danger)', 
                            color: 'white', 
                            border: 'none', 
                            cursor: 'pointer',
                            width: '100%'
                          }}
                        >
                          Devolver Libro
                        </button>
                      </div>
                  )}
              </li>
            ))}
          </div>
        </>
      )}
    </div>
  );
}