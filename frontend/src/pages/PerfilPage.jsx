import { useState, useEffect } from "react";
import api from "../api/axios";

// (Opcional) Puedes crear un PerfilPage.css similar a LibroListPage.css
// para estilizar las tarjetas de los libros prestados.

export default function PerfilPage() {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Obtenemos al usuario de localStorage
  const usuario = JSON.parse(localStorage.getItem("usuario"));

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
              <p><strong>Estado:</strong> <span style={{ color: prestamo.estado === 'pendiente' ? 'orange' : 'green' }}>{prestamo.estado}</span></p>
            </div>
          </li>
        ))}
      </div>
    </div>
  );
}