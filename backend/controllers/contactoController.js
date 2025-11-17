import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const enviarCorreo = async (req, res) => {
  const { nombre, email, asunto, mensaje } = req.body;

  try {
    // 1. Configurar el transporte (quién envía)
    const transporter = nodemailer.createTransport({
      service: "gmail", // O tu proveedor (Outlook, Yahoo, etc.)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 2. Configurar el mensaje
    const mailOptions = {
      from: `"Biblioteca Escolar" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Se envía al administrador (tú mismo)
      replyTo: email, // Para que al responder le llegue al usuario
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