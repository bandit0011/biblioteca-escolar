import { useState } from "react";
import api from "../api/axios";

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: ""
  });
  const [status, setStatus] = useState(""); // Para mensajes de éxito/error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Enviando...");

    try {
      await api.post("/contacto", formData);
      setStatus("¡Mensaje enviado con éxito! Te contactaremos pronto.");
      setFormData({ nombre: "", email: "", asunto: "", mensaje: "" }); // Limpiar form
    } catch (error) {
      console.error("Error enviando formulario", error);
      setStatus("Hubo un error al enviar el mensaje. Intenta nuevamente.");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>Contáctanos</h1>
      <p style={{ textAlign: "center", marginBottom: "20px" }}>
        ¿Tienes dudas sobre un préstamo o sugerencias para la biblioteca? Escríbenos.
      </p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            placeholder="Tu nombre completo"
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="correo@ejemplo.com"
          />
        </div>

        <div>
          <label>Asunto:</label>
          <input
            type="text"
            name="asunto"
            value={formData.asunto}
            onChange={handleChange}
            required
            placeholder="Ej. Solicitud de libro nuevo"
          />
        </div>

        <div>
          <label>Mensaje:</label>
          <textarea
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Escribe tu mensaje aquí..."
            style={{
              width: "95%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-input-bg)",
              color: "var(--color-text)",
              fontFamily: "inherit",
              resize: "vertical"
            }}
          ></textarea>
        </div>

        <button type="submit" style={{ marginTop: "10px" }}>
          Enviar Mensaje
        </button>

        {status && (
          <p style={{ 
            marginTop: "15px", 
            textAlign: "center", 
            fontWeight: "bold",
            color: status.includes("error") ? "var(--color-danger)" : "var(--color-primary)"
          }}>
            {status}
          </p>
        )}
      </form>
    </div>
  );
}