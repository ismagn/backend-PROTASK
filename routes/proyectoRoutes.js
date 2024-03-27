import express from "express";
import {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyectos,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador,
    buscarColaborador,
} from '../controllers/proyectoController.js'
import checKAuth from '../middleware/checkAuth.js'

const router = express.Router();

router.get('/',checKAuth, obtenerProyectos)
router.post('/',checKAuth, nuevoProyecto)

//otro formato de ruta donde cada ruta ocupara una direccion en comun y el id
router
    .route('/:id')
    .get(checKAuth, obtenerProyecto)
    .put(checKAuth,editarProyectos)
    .delete(checKAuth,eliminarProyecto)

router.post('/colaboradores',checKAuth, buscarColaborador)
router.post('/colaboradores/:id',checKAuth, agregarColaborador)
router.post('/eliminar-colaborador/:id',checKAuth, eliminarColaborador) //aqui se utilizo post en lugar de delete ya que solo se borrara una parte y no todo el recurso completo

export default router;