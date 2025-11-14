import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import LibroForm from "../components/LibroForm";

export default function LibroFormPage() {
  const [categorias, setCategorias] = useState([]);
  const [libro, setLibro] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  // Cargar categorías
  useEffect(() => {
    api.get("/categorias")
      .then(res => setCategorias(res.data))
      .catch(err => console.log("Error cargando categorías", err));
  }, []);

  // Cargar datos del libro si es edición
  useEffect(() => {
    if (id) {
      api.get(`/libros/${id}`)
        .then(res => setLibro(res.data))
        .catch(err => console.log("Error cargando libro", err));
    }
  }, [id]);

  // Función para crear o actualizar libro
  const handleSubmit = async (data) => {
    try {
      if (id) {
        await api.put(`/libros/${id}`, data);
      } else {
        await api.post("/libros", data);
      }
      navigate("/admin");
    } catch (error) {
      console.error("Error guardando libro:", error);
    }
  };

  return (
    <div>
      <h1>{id ? "Editar Libro" : "Registrar Libro"}</h1>
      <LibroForm libroInicial={libro} categorias={categorias} onSubmit={handleSubmit} />
    </div>
  );
}
