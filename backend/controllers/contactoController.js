import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const enviarCorreo = async (req, res) => {
  const { nombre, email, asunto, mensaje } = req.body;

  console.log("Intentando enviar correo con:");
  console.log("User:", process.env.EMAIL_USER);
  // NO imprimas la contraseña completa, solo los primeros 3 caracteres para ver si existe
  console.log("Pass (inicio):", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.substring(0, 3) + "..." : "NO DEFINIDA");

  try {
    // Usamos 'service: gmail' en lugar de host/port manuales
    const transporter = nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 587,             // <--- CAMBIO 1: Puerto 587
      secure: false,         // <--- CAMBIO 2: false (usa STARTTLS)
      auth: {
        user: 'resend',            // El usuario SIEMPRE es 'resend'
        pass: process.env.EMAIL_PASS // Aquí va tu API Key de Resend (re_123...)
      },
      requireTLS: true,
    });

    // 2. Configurar el mensaje
    const mailOptions = {
      from: 'onboarding@resend.dev', // <--- OJO: Resend te obliga a usar este remitente en la versión gratis
      to: 'andres.rojasxv@gmail.com', // A donde quieres que llegue (tu correo real)
      replyTo: email, // Para que puedas responderle al usuario
      subject: `Nuevo mensaje de contacto: ${asunto}`,
      text: `
        Nombre: ${nombre}
        Email: ${email}
        Mensaje:
        ${mensaje}
      `,
      html: `
        <h3>Nuevo mensaje desde la Biblioteca</h3>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje}</p>
      `,
    };

    // 3. Enviar
    await transporter.sendMail(mailOptions);

    res.status(200).json({ mensaje: "Correo enviado exitosamente" });
  } catch (error) {
    console.error("Error enviando correo:", error);
    res.status(500).json({ mensaje: "Error al enviar el correo", error });
  }
};