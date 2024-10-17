const { Router } = require('express');
const UsuarioControlador = require('../controllers/Usuario');

const router = Router();

router.get('/', UsuarioControlador.getUsuarios);

module.exports = router;