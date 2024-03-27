import express from "express";
const router = express.Router();

import { registrar,autenticar,confirmar, olvidoPassword, comprobarToken, nuevoPassword, perfil } from "../controllers/usuarioController.js";

import checKAuth from "../middleware/checkAuth.js";

//autenticacion, registro y confirmacion de usuarios

router.post('/', registrar);
router.post('/login', autenticar);
router.get('/confirmar/:token', confirmar); //routing dinamico, crea una variable para obtener el valor por la url
router.post('/olvido-password', olvidoPassword);
router.route('/olvido-password/:token').get(comprobarToken).post(nuevoPassword)

router.get('/perfil',checKAuth, perfil); //se pone un middleware para comprobar antes de entrar al controlador perfil

export default router;