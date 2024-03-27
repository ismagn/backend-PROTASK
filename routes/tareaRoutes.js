import express from "express";

import {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado
} from '../controllers/tareaController.js'
import checKAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.post('/',checKAuth, agregarTarea),
router 
    .route("/:id")
    .get(checKAuth,obtenerTarea)
    .put(checKAuth,actualizarTarea)
    .delete(checKAuth,eliminarTarea)

router.put("/estado/:id",checKAuth, cambiarEstado);

export default router