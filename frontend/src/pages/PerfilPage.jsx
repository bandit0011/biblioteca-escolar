import { toast } from 'sonner';
import { useState, useEffect } from "react";
import api from "../api/axios";

export default function PerfilPage() {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState(JSON.parse(localStorage.getItem("usuario")));

  // Estados para el modo edición
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nombre: usuario?.nombre || "",
    email: usuario?.email || "",
    passwordActual: "",
    passwordNuevo: ""
  });

  // Cargar préstamos (Lógica existente)
  const cargarMisPrestamos = () => {
    api.get("/prestamos/mis-prestamos")
      .then(res => setPrestamos(res.data))
      .catch(err => console.error("Error cargando mis préstamos:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (usuario?.rol !== "bibliotecario") {
      cargarMisPrestamos();
    } else {
      setLoading(false);
    }
  }, []);

  // Manejo del formulario de edición
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdatePerfil = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/auth/perfil", formData);
      
      // Actualizar localStorage y Estado
      const usuarioActualizado = res.data.usuario;
      localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
      setUsuario(usuarioActualizado);
      
      // Disparar evento para que la Navbar se actualice sola
      window.dispatchEvent(new Event("storage"));

      toast.success("Perfil actualizado con éxito");
      setEditMode(false);
      setFormData({ ...formData, passwordActual: "", passwordNuevo: "" }); // Limpiar passwords
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Error al actualizar perfil");
    }
  };

  // ... (Mantener tu función handleDevolver existente aquí) ...
  const handleDevolver = async (id_prestamo) => { /* ... tu código ... */ };

  return (
    <div>
      <h1>Mi Perfil</h1>

      {/* --- TARJETA DE USUARIO --- */}
      {usuario && (
        <div style={{ background: 'var(--color-card-bg)', padding: '20px', borderRadius: '8px', maxWidth: '600px', margin: 'auto', marginBottom: '30px' }}>
          
          {!editMode ? (
            // VISTA DE DATOS (SOLO LECTURA)
            <>
              <p><strong>Nombre:</strong> {usuario.nombre}</p>
              <p><strong>Email:</strong> {usuario.email}</p>
              <p><strong>Rol:</strong> <span style={{textTransform: 'capitalize'}}>{usuario.rol}</span></p>
              
              {/* Botón Editar: Solo si NO es admin */}
              {usuario.rol !== 'admin' && (
                <button 
                  onClick={() => setEditMode(true)}
                  style={{ marginTop: '15px', background: 'var(--color-primary)' }}
                >
                  ✏️ Editar Mis Datos
                </button>
              )}
            </>
          ) : (
            // VISTA DE EDICIÓN (FORMULARIO)
            <form onSubmit={handleUpdatePerfil} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3 style={{margin: '0 0 10px 0'}}>Editar Perfil</h3>
              
              <label>Nombre:</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
              
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
              
              <hr style={{width: '100%', borderColor: 'var(--color-border)', margin: '10px 0'}} />
              <p style={{fontSize: '0.9em', color: '#888'}}>Dejar en blanco si no quieres cambiar la contraseña:</p>
              
              <label>Nueva Contraseña:</label>
              <input type="password" name="passwordNuevo" value={formData.passwordNuevo} onChange={handleInputChange} placeholder="Nueva contraseña (opcional)" />
              
              <label>Contraseña Actual (Requerida para cambios de clave):</label>
              <input type="password" name="passwordActual" value={formData.passwordActual} onChange={handleInputChange} placeholder="Tu contraseña actual" />

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1 }}>Guardar Cambios</button>
                <button type="button" onClick={() => setEditMode(false)} style={{ flex: 1, background: '#666' }}>Cancelar</button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* --- SECCIÓN DE PRÉSTAMOS (Solo si no es bibliotecario) --- */}
      {usuario?.rol !== "bibliotecario" && !editMode && (
        <>
            {/* ... (Aquí va tu código existente para mostrar la lista de préstamos) ... */}
             {/* Asegúrate de mantener el .map de prestamos y el botón de devolver */}
             <h2 style={{ marginTop: '30px' }}>Mis Préstamos</h2>
             {/* ... etc ... */}
             <div className="libros-grid" style={{ marginTop: '20px' }}>
                {prestamos.map(prestamo => (
                  <li key={prestamo.id_prestamo} className="libro-card">
                    {/* COPIAR TU CÓDIGO EXISTENTE DE RENDERIZADO DE TARJETA AQUÍ */}
                     <img 
                        src={prestamo.Libro.imagen_url || "https://i.imgur.com/sJ3CT4V.png"}
                        alt={`Portada de ${prestamo.Libro.titulo}`} 
                        className="libro-card-imagen"
                      />
                      <div className="libro-card-info">
                        <h3>{prestamo.Libro.titulo}</h3>
                        {/* ... resto de datos ... */}
                        <p><strong>Estado:</strong> <span className={`status status-${prestamo.estado}`}>{prestamo.estado}</span></p>
                      </div>
                      {prestamo.estado === 'aprobado' && (
                        <div className="libro-card-admin">
                            <button onClick={() => handleDevolver(prestamo.id_prestamo)} style={{background: 'var(--color-danger)', color: 'white', width: '100%', border: 'none', cursor: 'pointer'}}>
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