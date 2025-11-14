import api from "../api/axios"; // CORREGIDO: ruta de importación del API
export default function LibroList({ libros, onUpdate }) { 
  const eliminarLibro = async (id) => {
    if (!window.confirm("¿Eliminar libro?")) return;
    try {
      await api.delete(`/libros/${id}`);
      onUpdate(); // CORREGIDO: Llama a onUpdate para recargar la lista en el componente padre
    } catch (error) {
    console.error("Error eliminando libro:", error);
  }
  };

  return (
    <table className="table table-striped mt-3">
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Autor</th>
          <th>Categoría</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {libros.map((libro) => (
          <tr key={libro.id_libro}>
            <td>{libro.id_libro}</td>
            <td>{libro.titulo}</td>
            <td>{libro.autor}</td>
            <td>{libro.Categoria?.nombre || "Sin categoría"}</td>
            <td>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => eliminarLibro(libro.id_libro)}
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
