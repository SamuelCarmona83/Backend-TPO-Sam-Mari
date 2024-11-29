const express = require('express');
const gastosControlador = require('../controllers/GastosControlador');
const router = express.Router();
const {validarJWT} = require('../middelwares/jwtValidador');

router.post('/crearGasto',validarJWT, gastosControlador.crearGasto); // Crear un gasto
router.delete('/eliminarGasto/:gastoID',validarJWT, gastosControlador.eliminarGasto); // Eliminar un gasto por ID
router.get('/obtenerGastosUsuario/:proyectoID/:usuarioID',validarJWT, gastosControlador.obtenerGastosDelUsuarioPorProyecto); // Obtener gastos por usuario y proyecto
router.get('/gastosProyecto/:proyectoID', validarJWT, gastosControlador.obtenerGastosPorProyecto);

module.exports = router;