const { Router } = require('express');
const ProyectoControlador = require('../controllers/ProyectoControlador');
const Proyecto = require('../BD/Model/Proyecto');
const {validarJWT} = require('../middelwares/jwtValidador');

const router = Router();

router.get('/proyectosUsuario/:usuarioId',validarJWT, ProyectoControlador.getProyectos);
router.get('/getProyecto/:id',validarJWT, ProyectoControlador.getProyecto);
router.post('/crearProyecto',validarJWT, ProyectoControlador.crearProyecto);
router.post('/editarProyecto/:id',validarJWT, ProyectoControlador.editarProyecto);
router.delete('/eliminarProyecto/:id',validarJWT, ProyectoControlador.eliminarProyecto);
router.get('/participantesDelProyecto/:id',validarJWT, ProyectoControlador.participantesDelProyecto);// cambiar
router.post('/agregarParticipante/:id',validarJWT, ProyectoControlador.agregarParticipante );



module.exports = router; 