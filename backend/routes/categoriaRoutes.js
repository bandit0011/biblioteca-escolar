import express from "express";
// 1. Importa la nueva función 'actualizarCategoria'
import { 
  obtenerCategorias, 
  crearCategoria, 
  eliminarCategoria, 
  actualizarCategoria // <-- AÑADIR ESTA
} from "../controllers/categoriaController.js";
import { verificarToken, soloBibliotecario } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas públicas (lectura)
router.get("/", obtenerCategorias);

// Rutas protegidas (solo administradores)
router.post("/", verificarToken, soloBibliotecario, crearCategoria);
router.delete("/:id", verificarToken, soloBibliotecario, eliminarCategoria);

// 2. Añade la nueva ruta PUT
router.put("/:id", verificarToken, soloBibliotecario, actualizarCategoria);

export default router;