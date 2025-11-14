import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/asociaciones.js";

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, contrasena, rol } = req.body;
    const existente = await Usuario.findOne({ where: { email } });
    if (existente) return res.status(400).json({ mensaje: "Email ya registrado" });

    const hashed = await bcrypt.hash(contrasena, 10);
    const nuevo = await Usuario.create({ nombre, email, contrasena: hashed, rol });

    res.status(201).json({ mensaje: "Usuario creado", usuario: nuevo });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar usuario", error });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const { email, contrasena } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    const valido = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!valido) return res.status(401).json({ mensaje: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: usuario.id_usuario, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ mensaje: "Login exitoso", token });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al iniciar sesión", error });
  }
};
