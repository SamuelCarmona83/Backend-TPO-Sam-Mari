const { Router } = require('express');
const UsuarioControlador = require('../controllers/Usuario');
const Usuario = require('../BD/Model/Usuario');

const router = Router();

router.get('/', UsuarioControlador.getUsuarios);

router.get('/:id', UsuarioControlador.getUsuario);



module.exports = router;