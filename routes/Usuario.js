const { Router } = require('express');
const UsuarioControlador = require('../controllers/UsuarioControlador');
const Usuario = require('../BD/Model/Usuario');
const {validarJWT} = require('../middelwares/jwtValidador');


const router = Router();

router.get('/', UsuarioControlador.getUsuarios);
router.get('/:id', UsuarioControlador.getUsuariobyID);
router.post('/login', UsuarioControlador.loginUsuario);
router.post('/registrarse', UsuarioControlador.registrarUsuario);
router.post('/recuperarContra', UsuarioControlador.recuperarContraseña);
router.post('/modificarUsuario', validarJWT, UsuarioControlador.modificarUsuario);
router.post('/buscarUsuario', validarJWT, UsuarioControlador.buscarUsuarioPorNombre);

module.exports = router;