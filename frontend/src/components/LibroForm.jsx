import { useState, useEffect } from "react";

export default function LibroForm({ libroInicial = {}, categorias = [], onSubmit }) {
  // 1. Inicializa el estado SIEMPRE vacío.
  const [libro, setLibro] = useState({
    titulo: "",
    autor: "",
    anio_publicacion: "",
    categoria_id: "",
    imagen_url: "", // <-- AÑADIR ESTADO INICIAL
    cantidad_total: 1,
    cantidad_disponible: 1,
  });

  // 2. AÑADE ESTE HOOK
  // Este 'useEffect' observará la prop 'libroInicial'.
  // Cuando 'libroInicial' cambie (es decir, cuando la API responda),
  // este código se ejecutará y actualizará el estado interno 'libro'.
  useEffect(() => {
    // Verificamos que 'libroInicial' tenga datos antes de actualizar
    if (libroInicial && libroInicial.id_libro) {
      setLibro({
        ...libro, // Mantiene valores por defecto si alguno falta
        ...libroInicial, // Sobrescribe con los datos cargados
        
        // Nos aseguramos que los campos null/undefined se conviertan en string vacío
        // para que los inputs controlados funcionen bien.
        anio_publicacion: libroInicial.anio_publicacion ?? "",
        categoria_id: libroInicial.categoria_id ?? "",
        imagen_url: libroInicial.imagen_url ?? "",
      });
    }
  }, [libroInicial]); // <-- Dependencia: se ejecuta solo si 'libroInicial' cambia

  const handleChange = (e) => {
    setLibro({ ...libro, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Creamos una copia para limpiar los datos antes de enviar
    const datosEnviar = { ...libro };
    
    // Convertimos campos vacíos de número a null si es necesario
    if (datosEnviar.anio_publicacion === "") {
      datosEnviar.anio_publicacion = null;
    }
    
    onSubmit(datosEnviar);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 3. CORREGIDO: Añade '|| ""' a los 'value' para evitar errores de React */}
      <div>
        <label>Título:</label>
        <input
          type="text"
          name="titulo"
          value={libro.titulo || ''} 
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Autor:</label>
        <input
          type="text"
          name="autor"
          value={libro.autor || ''}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <label>URL de la Portada (Imagen):</label>
        <input
          type="text"
          name="imagen_url"
          value={libro.imagen_url || ''}
          onChange={handleChange}
          placeholder="https://ejemplo.com/portada.jpg"
        />
      </div>

      <div>
        <label>Año de publicación:</label>
        <input
          type="number"
          name="anio_publicacion"
          value={libro.anio_publicacion || ''}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Categoría:</label>
        <select
          name="categoria_id"
          value={libro.categoria_id || ''}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione una categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id_categoria} value={cat.id_categoria}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Cantidad total:</label>
        <input
          type="number"
          name="cantidad_total"
          value={libro.cantidad_total || 1}
          onChange={handleChange}
          required
        />
      </div>
      
      <div>
        <label>Cantidad disponible:</label>
        <input
          type="number"
          name="cantidad_disponible"
          value={libro.cantidad_disponible || 1}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit">
        {/* Usamos 'libroInicial' (de las props) para decidir el texto, 
           ya que el 'libro' (del estado) siempre tendrá datos. */}
        {libroInicial.id_libro ? "Guardar cambios" : "Registrar"}
      </button>
    </form>
  );
}