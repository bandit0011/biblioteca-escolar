import express from "express";
import { obtenerCategorias, crearCategoria, eliminarCategoria } from "../controllers/categoriaController.js";
import { verificarToken, soloBibliotecario } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas públicas (lectura)
router.get("/", obtenerCategorias);

// Rutas protegidas (solo administradores)
router.post("/", verificarToken, soloBibliotecario, crearCategoria);
router.delete("/:id", verificarToken, soloBibliotecario, eliminarCategoria);

export default router;
