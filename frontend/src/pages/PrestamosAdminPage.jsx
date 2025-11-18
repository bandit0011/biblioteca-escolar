import { toast } from 'sonner';
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function PrestamosAdminPage() {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar todos los préstamos
  const cargarPrestamos = async () => {
    try {
      setLoading(true);
      const res = await api.get("/prestamos");
      // Filtramos solo los pendientes para esta vista principal
      // (Opcional: podrías mostrar todos y filtrar en pantalla)
      setPrestamos(res.data.filter(p => p.estado === 'pendiente'));
    } catch (error) {
      console.error("Error cargando préstamos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPrestamos();
  }, []);

  const gestionarPrestamo = async (id, nuevoEstado) => {
    if (!window.confirm(`¿Seguro que deseas marcar este préstamo como ${nuevoEstado}?`)) return;

    try {
      await api.put(`/prestamos/${id}/estado`, { estado: nuevoEstado });
      toast.success(`Préstamo ${nuevoEstado} con éxito`);
      cargarPrestamos(); // Recargar la lista
    } catch (error) {
      console.error("Error al gestionar:", error);
      toast.error("Hubo un error al actualizar el estado.");
    }
  };

  if (loading) return <p>Cargando solicitudes...</p>;

  return (
    <div>
      <h1>Solicitudes de Préstamo</h1>
      
      {prestamos.length === 0 ? (
        <p>No hay solicitudes pendientes.</p>
      ) : (
        <div className="tabla-container"> 
           {/* Puedes usar una tabla HTML simple o divs estilo card */}
           <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '20px'}}>
             <thead>
               <tr style={{background: 'var(--color-card-bg)', textAlign: 'left'}}>
                 <th style={{padding: '10px'}}>Libro</th>
                 <th style={{padding: '10px'}}>Usuario</th>
                 <th style={{padding: '10px'}}>Fechas</th>
                 <th style={{padding: '10px'}}>Acciones</th>
               </tr>
             </thead>
             <tbody>
               {prestamos.map(p => (
                 <tr key={p.id_prestamo} style={{borderBottom: '1px solid var(--color-border)'}}>
                   <td style={{padding: '10px'}}>{p.Libro?.titulo}</td>
                   {/* Asegúrate que tu backend envíe el usuario en el include, 
                       si no, tendrás que ajustar el controlador listarPrestamos */}
                   <td style={{padding: '10px'}}>{p.Usuario ? p.Usuario.nombre : `ID: ${p.id_usuario}`}</td>
                   <td style={{padding: '10px'}}>
                     Del: {p.fecha_prestamo} <br/> 
                     Al: {p.fecha_devolucion}
                   </td>
                   <td style={{padding: '10px', display: 'flex', gap: '10px'}}>
                     <button 
                       onClick={() => gestionarPrestamo(p.id_prestamo, 'aprobado')}
                       style={{background: 'var(--color-primary)', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer'}}
                     >
                       ✅ Aprobar
                     </button>
                     <button 
                       onClick={() => gestionarPrestamo(p.id_prestamo, 'rechazado')}
                       style={{background: 'var(--color-danger)', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer'}}
                     >
                       ❌ Rechazar
                     </button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      )}
    </div>
  );
}