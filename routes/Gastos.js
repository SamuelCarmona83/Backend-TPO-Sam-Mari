const express = require('express');
const gastosControlador = require('../controllers/GastosControlador');
const router = express.Router();
const {validarJWT} = require('../middelwares/jwtValidador');

router.post('/crearGasto',validarJWT, gastosControlador.crearGasto);
router.delete('/eliminarGasto/:gastoID',validarJWT, gastosControlador.eliminarGasto);
router.get('/obtenerGastosUsuario/:proyectoID/:usuarioID',validarJWT, gastosControlador.obtenerGastosDelUsuarioPorProyecto);
router.get('/gastosProyecto/:proyectoID', validarJWT, gastosControlador.obtenerGastosPorProyecto);

module.exports = router;