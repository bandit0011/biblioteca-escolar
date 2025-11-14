import express from "express";
import {
  crearPrestamo,
  listarPrestamos,
  devolverLibro,
  obtenerMisPrestamos // <-- 1. Importar
} from "../controllers/prestamoController.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verificarToken, listarPrestamos);
router.post("/", verificarToken, crearPrestamo);
router.get("/mis-prestamos", verificarToken, obtenerMisPrestamos);
router.put("/:id/devolver", verificarToken, devolverLibro);

export default router;
