const { Router } = require('express');
const UsuarioControlador = require('../controllers/UsuarioControlador');
const Usuario = require('../BD/Model/Usuario');


const router = Router();

router.get('/', UsuarioControlador.getUsuarios);
router.get('/:id', UsuarioControlador.getUsuariobyID);
router.post('/login', UsuarioControlador.loginUsuario);
router.post('/registrarse', UsuarioControlador.registrarUsuario);
router.post('/modificarUsuario', UsuarioControlador.modificarUsuario);
router.post('/recuperarContra', UsuarioControlador.recuperarContraseña);

module.exports = router;