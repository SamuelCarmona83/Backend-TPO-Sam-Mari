const { where, Op } = require('sequelize');
const { Usuario } = require('../BD/bd');
const bcrypt = require('bcrypt');
require('dotenv').config();
const traerTodosLosUsuarios = async () => await Usuario.findAll();
const traerUsuario = async (userid) => await Usuario.findOne({ where: { ID: userid } });

const getUsuarios = async (req, res) => {// esta creo que no deberia estar // borrar luego //
    try {
        const usuarios = await traerTodosLosUsuarios();
        res.status(200).json(usuarios);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

const getUsuariobyID = async(req, res)=>{
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

        const contraseñaHash = await bcrypt.hash(clave, process.env.SALT);
        if (contraseñaHash != usuario.contraseña) {
            return res.status(401).json({ mensaje: 'Clave incorrecta' });
        }

        res.status(200).json({ mensaje: 'Inicio de sesión exitoso', usuario: usuario });
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

        const contraseñaHash = await bcrypt.hash(clave, process.env.SALT);
        
        await Usuario.create({nombre: nombre, email: email, contraseña: contraseñaHash, imagen: ""});

        res.status(200).json({
            mensaje: 'Usuario registrado exitosamente'
        });

    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({ error: 'Error al registrar el usuario  ' + error});
    }
    
}

const modificarUsuario = async (req, res) => {// por ahora lo hare sin el tema de la imagen
    const {nombre, email, contraseña, ID} = req.body;

    try{
        const usuarioAModificar = traerUsuario(ID);
        if(!usuarioAModificar){
            return res.status(400).json({mensaje: "El usuario no existe"})
        }
        if(nombre){
            usuarioAModificar.nombre = nombre;
        }
        if(email){
            usuarioAModificar.email = email;
        }
        if(contraseña){
            const contraseñaHash = bcrypt.hash(contraseña, process.env.SALT);
            usuarioAModificar.contraseña = contraseñaHash;
        }
        res.status(200).json({mensaje: "Se modifico correctamente el usuario" + nombre});
    }catch(error){
        console.error('Error al modificar el usuario:', error);
        res.status(500).json({ error: 'Error al modificar el usuario' });
    }
}

const buscarUsuarioPorNombre = async (req, res) => {
    const { nombre } = req.body; 

    if (!nombre) {
        return res.status(400).json({ mensaje: 'Debes proporcionar un nombre para buscar' });
    }

    try {
        const usuarios = await Usuario.findAll({
            where: {
                [Op.or]: [
                    { nombre: { [Op.like]: `%${nombre}%` } }
                ]
            }
        });

        if (usuarios.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron usuarios con ese criterio' });
        }

        res.status(200).json(usuarios);
    } catch (err) {
        console.error('Error al buscar usuarios:', err);
        res.status(500).json({ mensaje: 'Error al buscar usuarios' });
    }
};

module.exports = {
    getUsuarios,
    getUsuariobyID,
    loginUsuario,
    registrarUsuario,
    modificarUsuario,
    buscarUsuarioPorNombre
};