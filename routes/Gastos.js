const express = require('express');
const { crearGasto, eliminarGasto, obtenerGastosDelUsuarioPorProyecto } = require('../controllers/GastosControlador');
const router = express.Router();
const {validarJWT} = require('../middelwares/jwtValidador');

router.post('/gastos',validarJWT, crearGasto); // Crear un gasto
router.delete('/gastos/:id',validarJWT, eliminarGasto); // Eliminar un gasto por ID
router.get('/gastos/:id',validarJWT, obtenerGastosDelUsuarioPorProyecto); // Obtener gastos por usuario y proyecto

module.exports = router;