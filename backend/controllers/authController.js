import { Usuario } from "../models/asociaciones.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ✅ Registro de usuario
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, contrasena, rol } = req.body;

    // Verificar si el correo ya existe
    const existeUsuario = await Usuario.findOne({ where: { email } });
    if (existeUsuario) {
      return res.status(400).json({ error: "El correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      contrasena: hashedPassword,
      rol: rol || "estudiante",
    });

    res.json({
      mensaje: "Usuario registrado correctamente",
      usuario: {
        id_usuario: nuevoUsuario.id_usuario,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
      },
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

// ✅ Inicio de sesión (login)
export const loginUsuario = async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    // Buscar usuario por email
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verificar contraseña
    const esValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esValida) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Crear token JWT
    const token = jwt.sign(
      { id: usuario.id_usuario, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      mensaje: "Inicio de sesión exitoso",
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error en inicio de sesión" });
  }
};

export const actualizarPerfil = async (req, res) => {
  try {
    // El ID y Rol vienen del token (gracias al middleware verificarToken)
    const { id, rol } = req.usuario;
    const { nombre, email, passwordActual, passwordNuevo } = req.body;

    // 1. RESTRICCIÓN: Impedir que el admin use esta ruta
    if (rol === 'admin') {
      return res.status(403).json({ error: "Los administradores no pueden editar su perfil desde aquí." });
    }

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // 2. Actualizar Nombre
    if (nombre) usuario.nombre = nombre;

    // 3. Actualizar Email (Verificando que no esté en uso por otro)
    if (email && email !== usuario.email) {
      const existeEmail = await Usuario.findOne({ where: { email } });
      if (existeEmail) {
        return res.status(400).json({ error: "El correo ya está registrado por otro usuario" });
      }
      usuario.email = email;
    }

    // 4. Actualizar Contraseña (Si se envía)
    if (passwordNuevo) {
      // Es recomendable pedir la contraseña actual por seguridad
      if (!passwordActual) {
        return res.status(400).json({ error: "Debes ingresar tu contraseña actual para cambiarla" });
      }
      
      const passwordValido = await bcrypt.compare(passwordActual, usuario.contrasena);
      if (!passwordValido) {
        return res.status(401).json({ error: "La contraseña actual es incorrecta" });
      }

      usuario.contrasena = await bcrypt.hash(passwordNuevo, 10);
    }

    await usuario.save();

    res.json({
      mensaje: "Perfil actualizado correctamente",
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });

  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({ error: "Error al actualizar perfil" });
  }
};