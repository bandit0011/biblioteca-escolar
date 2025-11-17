import express from "express";
import { enviarCorreo } from "../controllers/contactoController.js";

const router = express.Router();

// Ruta POST pública (cualquiera puede contactar)
router.post("/", enviarCorreo);

export default router;