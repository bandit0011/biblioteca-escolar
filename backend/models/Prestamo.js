import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Usuario } from "./Usuario.js";
import { Libro } from "./Libro.js";

export const Prestamo = sequelize.define("Prestamo", {
  id_prestamo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fecha_prestamo: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
  fecha_devolucion: { type: DataTypes.DATEONLY },
  estado: {
    type: DataTypes.ENUM("pendiente", "devuelto", "retrasado"),
    defaultValue: "pendiente",
  },
});

Prestamo.belongsTo(Usuario, { foreignKey: "id_usuario" });
Prestamo.belongsTo(Libro, { foreignKey: "id_libro" });
