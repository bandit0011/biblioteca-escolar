import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ mensaje: "Token no proporcionado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(403).json({ mensaje: "Token inválido o expirado" });
  }
};

export const soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== "admin")
    return res.status(403).json({ mensaje: "Acceso solo para administradores" });
  next();
};

export const soloBibliotecario = (req, res, next) => {
  if (req.usuario.rol !== "admin" && req.usuario.rol !== "bibliotecario")
    return res.status(403).json({ mensaje: "Solo bibliotecarios o admin" });
  next();
};
