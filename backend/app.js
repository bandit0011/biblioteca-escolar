import express from "express";
import cors from "cors";
import morgan from "morgan";
import { conectarDB } from "./config/db.js";
import contactoRoutes from "./routes/contactoRoutes.js";

// import usuarioRoutes from "./routes/usuarioRoutes.js"; // <-- Eliminado/Comentado
import libroRoutes from "./routes/libroRoutes.js";
import categoriaRoutes from "./routes/categoriaRoutes.js";
import prestamoRoutes from "./routes/prestamoRoutes.js";
import "./models/asociaciones.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// app.use("/api/usuarios", usuarioRoutes); // <-- Eliminado/Comentado
app.use("/api/libros", libroRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/prestamos", prestamoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contacto", contactoRoutes);

await conectarDB();

export default app;