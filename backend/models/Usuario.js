import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Usuario = sequelize.define("Usuario", {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: { // ✅ este es el nombre correcto
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  contrasena: { // ✅ sin tilde ni “ñ”
    type: DataTypes.STRING,
    allowNull: false,
  },
  rol: {
    type: DataTypes.ENUM("admin", "bibliotecario", "estudiante"),
    defaultValue: "estudiante",
  },
  fecha_registro: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  // +++ AÑADE ESTE BLOQUE +++
  tableName: "usuarios", // Tu tabla se llama "usuarios" en plural
  timestamps: false    // Para que no busque createdAt/updatedAt
});
