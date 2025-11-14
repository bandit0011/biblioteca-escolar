import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";

export default function EditarLibroPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");

  useEffect(() => {
    const cargarLibro = async () => {
      const res = await api.get(`/libros/${id}`);
      setTitulo(res.data.titulo ?? "");
      setAutor(res.data.autor ?? "");
    };

    cargarLibro();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put(`/libros/${id}`, { titulo, autor });
    navigate("/admin");
  };

  return (
    <div>
      <h2>Editar Libro #{id}</h2>

      <form onSubmit={handleSubmit}>
        <label>Título:</label>
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} />

        <label>Autor:</label>
        <input value={autor} onChange={(e) => setAutor(e.target.value)} />

        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
}
