import express from "express";
// CORREGIDO: Se importa la función obtenerLibroPorId que faltaba en el import
import { obtenerLibros, crearLibro, actualizarLibro, eliminarLibro, obtenerLibroPorId } from "../controllers/libroController.js";
import { verificarToken, soloBibliotecario } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas públicas (lectura)
router.get("/", obtenerLibros);
router.get("/:id", obtenerLibroPorId); // CORREGIDO: Usa obtenerLibroPorId

// Rutas protegidas (solo administradores)
router.post("/", verificarToken, soloBibliotecario, crearLibro);
router.put("/:id", verificarToken, soloBibliotecario, actualizarLibro);
router.delete("/:id", verificarToken, soloBibliotecario, eliminarLibro);

export default router;
