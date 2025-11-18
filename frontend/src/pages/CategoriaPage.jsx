import { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "sonner";

// Aplicaremos los mismos estilos de formulario que ya definimos en App.css
// y añadiremos algunos estilos para la lista.

export default function CategoriaPage() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState("");
  const [idEditando, setIdEditando] = useState(null); // ID de la categoría que estamos editando

  // --- 1. Función para cargar categorías ---
  const cargarCategorias = () => {
    api.get("/categorias")
      .then(res => setCategorias(res.data))
      .catch(err => console.error("Error al cargar categorías", err));
  };

  // --- 2. Cargar categorías al iniciar ---
  useEffect(() => {
    cargarCategorias();
  }, []);

  // --- 3. Manejador del formulario (Crear o Actualizar) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre) return;

    try {
      if (idEditando) {
        // Modo Edición
        await api.put(`/categorias/${idEditando}`, { nombre });
      } else {
        // Modo Creación
        await api.post("/categorias", { nombre });
      }
      
      toast.success(idEditando ? "Categoría actualizada" : "Categoría creada"); // <--- Opcional: Agregar feedback de éxito

      // Limpiar y recargar
      setNombre("");
      setIdEditando(null);
      cargarCategorias();
      
    } catch (error) {
      console.error("Error al guardar categoría", error);
      toast.error("Error al guardar la categoría.");
    }
  };

  // --- 4. Manejador para Eliminar ---
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta categoría?")) return;

    try {
      await api.delete(`/categorias/${id}`);
      cargarCategorias();
    } catch (error) {
      console.error("Error al eliminar", error);
      toast.error("Error al eliminar. Asegúrate de que no esté siendo usada por ningún libro.");
    }
  };

  // --- 5. Funciones para entrar/salir del modo edición ---
  const handleEditar = (categoria) => {
    setNombre(categoria.nombre);
    setIdEditando(categoria.id_categoria);
  };

  const handleCancelarEdicion = () => {
    setNombre("");
    setIdEditando(null);
  };

  return (
    <div>
      <h1>Gestión de Categorías</h1>

      {/* Formulario de Creación/Edición */}
      <form onSubmit={handleSubmit}>
        <h3>{idEditando ? "Editando Categoría" : "Nueva Categoría"}</h3>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Ciencia Ficción"
            required
          />
        </div>
        <button type="submit">
          {idEditando ? "Actualizar" : "Crear"}
        </button>
        {idEditando && (
          <button type="button" onClick={handleCancelarEdicion} style={{ background: "#555" }}>
            Cancelar Edición
          </button>
        )}
      </form>

      {/* Lista de Categorías Existentes */}
      <h2 style={{ marginTop: '30px', textAlign: 'center' }}>Categorías Existentes</h2>
      <ul style={{ listStyle: 'none', padding: 0, maxWidth: '600px', margin: '0 auto' }}>
        {categorias.map((cat) => (
          <li key={cat.id_categoria} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#2c2c2c', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
            <span style={{ fontSize: '1.1em' }}>{cat.nombre}</span>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => handleEditar(cat)} style={{ padding: '5px 10px' }}>
                ✏️
              </button>
              <button onClick={() => handleEliminar(cat.id_categoria)} style={{ padding: '5px 10px', background: '#ff4444' }}>
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}