import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function LibroListPage() {
  const [libros, setLibros] = useState([]);

  useEffect(() => {
    api.get("/libros")
      .then(res => setLibros(res.data))
      .catch(err => console.log("Error cargando libros", err));
  }, []);

  return (
  <div>
    <h1>Lista de Libros</h1>
    {admin && <Link to="/admin/libros/nuevo">Agregar Libro</Link>}
    <ul>
      {libros.map(libro => (
        <li key={libro.id_libro}>
          {libro.titulo} - {libro.autor} - {libro.Categoria?.nombre || "Sin categoría"}
          {admin && (
            <>
              <Link to={`/admin/libros/editar/${libro.id_libro}`}>Editar</Link>
              <button onClick={() => eliminarLibro(libro.id_libro)}>Eliminar</button>
            </>
          )}
        </li>
      ))}
    </ul>
  </div>
);

}
