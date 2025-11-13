import express from "express";
import {
  crearPrestamo,
  listarPrestamos,
  devolverLibro
} from "../controllers/prestamoController.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verificarToken, listarPrestamos);
router.post("/", verificarToken, crearPrestamo);
router.put("/:id/devolver", verificarToken, devolverLibro);

export default router;
