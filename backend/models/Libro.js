import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Libro = sequelize.define("Libro", {
  id_libro: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: { type: DataTypes.STRING, allowNull: false },
  autor: { type: DataTypes.STRING, allowNull: false },
  anio_publicacion: { type: DataTypes.INTEGER },
  
  // +++ AÑADIR ESTA LÍNEA +++
  imagen_url: { type: DataTypes.STRING(500), allowNull: true },
  
  cantidad_total: { type: DataTypes.INTEGER, defaultValue: 1 },
  cantidad_disponible: { type: DataTypes.INTEGER, defaultValue: 1 },
  categoria_id: { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: "libros",
  timestamps: false,
});