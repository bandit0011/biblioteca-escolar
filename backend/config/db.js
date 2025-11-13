import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  }
);

export const conectarDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión con MySQL exitosa");
  } catch (error) {
    console.error("Error al conectar con MySQL:", error);
  }
};
