import { Link } from "react-router-dom";
// 1. Importa el componente de la lista de libros
import LibroListPage from "./LibroListPage";

export default function AdminDashboard() {
  // 2. NO hay useState, useEffect, ni cargarLibros aquí.
  // ¡Esto soluciona el error "libros is not defined"!

  return (
    <div>
      <h1>Panel de Administración</h1>
      
      {/* 3. Enlaces de navegación del Admin */}
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '20px', fontSize: '1.1em' }}>
        {/* Dejamos solo un enlace para "Agregar Libro" */}
        <Link to="/admin/libros/crear" className="admin-boton-crear">➕ Agregar Libro</Link>
        <Link to="/admin/categorias" className="admin-boton-crear">📚 Gestionar Categorías</Link>
        <Link to="/admin/prestamos" className="admin-boton-crear" style={{background: '#e67e22'}}>🛎️ Solicitudes</Link>
      </div>

      {/* 4. Renderizamos el componente que maneja su propia lógica de libros */}
      <LibroListPage admin={true} />
      
      {/* 5. Eliminamos todo el bloque {libros.map(...)} de aquí */}
    </div>
  );
}