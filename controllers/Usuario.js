const { where } = require('sequelize');
const { Usuario } = require('../BD/bd');
const traerTodosLosUsuarios = async () => await Usuario.findAll();
const traerUsuario = async (userid) => await Usuario.findOne({ where: { ID: userid } });

const getUsuarios = async (req, res) => {
    try {
        const usuarios = await traerTodosLosUsuarios();
        res.status(200).json(usuarios);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const getUsuario = async(req, res)=>{
    const userid = req.params.id;   
    try {
        const usuario = await traerUsuario(userid);
        res.status(200).json(usuario);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
    
}

const loginUsuario = async(req, res) =>{
    const {email, clave} = req.body;

    try{
        const usuario = await Usuario.findOne({where: {email}});
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        if (clave != usuario.contraseña) {
            return res.status(401).json({ mensaje: 'Clave incorrecta' });
        }

        res.json({ mensaje: 'Inicio de sesión exitoso', usuario });
        console.log(usuario)
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
}

const registrarUsuario = async(req, res) => {
    const {email, clave, nombre} = req.body;

    try {
        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ mensaje: 'El usuario ya está registrado' });
        }

        const nuevoUsuario = Usuario.create({nombre: nombre, email: email, contraseña:clave, imagen: ""});

        res.status(201).json({
            mensaje: 'Usuario registrado exitosamente',
        });

    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
    
}

module.exports = {
    getUsuarios,
    getUsuario,
    loginUsuario,
    registrarUsuario
};