import { useState, useEffect } from "react";

export default function LibroForm({ libroInicial = {}, categorias = [], onSubmit }) {
  const [libro, setLibro] = useState({
    titulo: "",
    autor: "",
    anio_publicacion: "",
    categoria_id: "",
    cantidad_total: 1,
    cantidad_disponible: 1,
    ...libroInicial,
  });

  const handleChange = (e) => {
    setLibro({ ...libro, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(libro);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Título:</label>
      <input
        type="text"
        name="titulo"
        value={libro.titulo}
        onChange={handleChange}
        required
      />

      <label>Autor:</label>
      <input
        type="text"
        name="autor"
        value={libro.autor}
        onChange={handleChange}
        required
      />

      <label>Año de publicación:</label>
      <input
        type="number"
        name="anio_publicacion"
        value={libro.anio_publicacion}
        onChange={handleChange}
      />

      <label>Categoría:</label>
      <select
        name="categoria_id"
        value={libro.categoria_id}
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

      <label>Cantidad total:</label>
      <input
        type="number"
        name="cantidad_total"
        value={libro.cantidad_total}
        onChange={handleChange}
        required
      />

      <label>Cantidad disponible:</label>
      <input
        type="number"
        name="cantidad_disponible"
        value={libro.cantidad_disponible}
        onChange={handleChange}
        required
      />

      <button type="submit">
        {libro.id_libro ? "Guardar cambios" : "Registrar"}
      </button>
    </form>
  );
}
