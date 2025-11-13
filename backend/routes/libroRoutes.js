import express from "express";
import { obtenerLibros, crearLibro, actualizarLibro, eliminarLibro } from "../controllers/libroController.js";
import { verificarToken, soloBibliotecario } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas públicas (lectura)
router.get("/", obtenerLibros);
router.get("/:id", obtenerLibros); // opcional: obtener un libro específico

// Rutas protegidas (solo administradores)
router.post("/", verificarToken, soloBibliotecario, crearLibro);
router.put("/:id", verificarToken, soloBibliotecario, actualizarLibro);
router.delete("/:id", verificarToken, soloBibliotecario, eliminarLibro);

export default router;
