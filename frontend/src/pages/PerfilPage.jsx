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
      // 1. Capturamos la respuesta de la API (que contiene el préstamo actualizado)
      const res = await api.put(`/prestamos/${id_prestamo}/devolver`);
      
      // 2. Obtenemos el préstamo con el nuevo estado: "devuelto"
      const prestamoActualizado = res.data.prestamo;

      // 3. Actualizamos el estado local INMEDIATAMENTE
      // Buscamos en la lista actual el préstamo que cambió y lo reemplazamos
      setPrestamos(prestamosActuales => 
        prestamosActuales.map(p => 
          p.id_prestamo === id_prestamo ? prestamoActualizado : p
        )
      );
      
      alert("Libro devuelto con éxito");
      
      // 4. YA NO necesitamos esta línea, la UI se actualiza al instante
      // cargarMisPrestamos(); 

    } catch (error) {
      console.error("Error al devolver el libro:", error);
      // Mostramos el mensaje de error del backend (ej. "Este libro ya fue devuelto")
      alert(error.response?.data?.mensaje || "No se pudo devolver el libro.");
    }
  };

  return (
    <div>
      <h1>Mi Perfil</h1>
      {usuario && (
        <div style={{ background: '#2c2c2c', padding: '20px', borderRadius: '8px', maxWidth: '600px', margin: 'auto' }}>
          <p><strong>Nombre:</strong> {usuario.nombre}</p>
          <p><strong>Email:</strong> {usuario.email}</p>
          <p><strong>Rol:</strong> {usuario.rol}</p>
        </div>
      )}

      <h2 style={{ marginTop: '30px' }}>Mis Préstamos</h2>
      {loading && <p>Cargando tus préstamos...</p>}
      
      {!loading && prestamos.length === 0 && (
        <p>Aún no has pedido ningún libro.</p>
      )}

      {/* Usamos la misma clase de cuadrícula que en LibroListPage */}
      <div className="libros-grid" style={{ marginTop: '20px' }}>
        {prestamos.map(prestamo => (
          <li key={prestamo.id_prestamo} className="libro-card">
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
          </li>
        ))}
      </div>
    </div>
  );
}