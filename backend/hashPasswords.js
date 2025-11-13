import bcrypt from "bcryptjs";
import { Usuario } from "./models/Usuario.js";
import { conectarDB } from "./config/db.js";

const actualizarPasswords = async () => {
  await conectarDB();

  const usuarios = await Usuario.findAll();

  for (const user of usuarios) {
    if (!user.contrasena.startsWith("$2a$")) { // evita volver a encriptar
      const hashed = await bcrypt.hash(user.contrasena, 10);
      user.contrasena = hashed;
      await user.save();
      console.log(`✅ Contraseña actualizada para: ${user.email}`);
    }
  }

  console.log("🔒 Todas las contraseñas han sido actualizadas.");
  process.exit();
};

actualizarPasswords();
