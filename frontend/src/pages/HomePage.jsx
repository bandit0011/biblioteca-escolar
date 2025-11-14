import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Bienvenido a la Biblioteca Escolar</h1>
      <p>Consulta nuestro catálogo de libros disponibles.</p>

      <Link
        to="/libros"
        style={{
          padding: "10px 20px",
          background: "blue",
          color: "white",
          borderRadius: "5px",
          textDecoration: "none",
          marginTop: "20px",
          display: "inline-block"
        }}
      >
        Ver Libros
      </Link>
    </div>
  );
}
