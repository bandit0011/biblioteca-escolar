import express from "express";
import { registrarUsuario, loginUsuario, actualizarPerfil } from "../controllers/authController.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/registro", registrarUsuario);
router.post("/login", loginUsuario);
router.put("/perfil", verificarToken, actualizarPerfil);

export default router;
