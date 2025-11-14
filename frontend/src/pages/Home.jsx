import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [libros, setLibros] = useState([]);

  useEffect(() => {
    api.get("/libros").then((res) => setLibros(res.data));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>📚 Biblioteca Escolar</h1>

      <Link to="/login">Iniciar Sesión (Administrador)</Link>

      <h2 style={{ marginTop: "20px" }}>Lista de Libros Disponibles</h2>

      {libros.length === 0 ? (
        <p>No hay libros disponibles.</p>
      ) : (
        libros.map((libro) => (
          <div key={libro.id_libro} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <h3>{libro.titulo}</h3>
            <p><b>Autor:</b> {libro.autor}</p>
            <p><b>Categoría:</b> {libro.Categoria?.nombre}</p> {/* CORREGIDO: Cambiado de Categorium a Categoria */}
            <p><b>Año:</b> {libro.anio_publicacion}</p>
          </div>
        ))
      )}
    </div>
  );
}
