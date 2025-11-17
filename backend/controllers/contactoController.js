import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

// Inicializamos Resend con la API Key que ya pusiste en Render (EMAIL_PASS)
const resend = new Resend(process.env.EMAIL_PASS);

export const enviarCorreo = async (req, res) => {
  const { nombre, email, asunto, mensaje } = req.body;

  console.log("📨 Iniciando envío vía HTTP con Resend...");

  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev", // Obligatorio en versión gratis
      to: "andres.rojasxv@gmail.com", // Tu correo (único permitido en versión gratis)
      reply_to: email, // Permitirá que respondas al usuario
      subject: `Nuevo mensaje de contacto: ${asunto}`,
      html: `
        <h3>Nuevo mensaje desde la Biblioteca</h3>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
      `,
    });

    if (error) {
      console.error("❌ Error devuelto por Resend:", error);
      return res.status(500).json({ mensaje: "Error al enviar el correo", error: error.message });
    }

    console.log("✅ Correo enviado con éxito. ID:", data.id);
    res.status(200).json({ mensaje: "Correo enviado exitosamente" });

  } catch (error) {
    console.error("❌ Error inesperado:", error);
    res.status(500).json({ mensaje: "Error interno al enviar correo", error: error.message });
  }
};