const { where, Op} = require('sequelize');
const { Usuario } = require('../db/bd');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const traerTodosLosUsuarios = async () => await Usuario.findAll();
const traerUsuario = async (ID) => {
    return await Usuario.findByPk(ID);
};
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
        
        const claveHash = await bcrypt.hash(clave, process.env.SALT);
        if (!(usuario.contraseña === claveHash)) {
            return res.status(401).json({ mensaje: 'Clave incorrecta' });
        }

        const token = jwt.sign(
            { id: usuario.ID, email: usuario.email }, 
            process.env.KEY,                          
            { expiresIn: "8h" }                       
        );

        res.status(200).json({
            mensaje: 'Inicio de sesión exitoso',
            token,
            usuario: {
                id: usuario.ID,
                nombre: usuario.nombre,
                email: usuario.email,
                edad: usuario.edad,
                fechaNacimiento: usuario.fechaNacimiento,
                imagen: usuario.imagen
            },
        });
        
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ mensaje: 'Error al iniciar sesión' });
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
    const {nombre, email, clave, ID, imagen} = req.body;

    try{
        const usuarioAModificar = await traerUsuario(ID);
        if (!usuarioAModificar && typeof usuarioAModificar.save !== 'function') {
            return res.status(400).json({ mensaje: "El usuario no existe o no se puede modificar" });
        }
        if(nombre && typeof nombre == "string"){
            usuarioAModificar.nombre = nombre;
        }
        if(email && typeof email == "string"){
            usuarioAModificar.email = email;
        }
        if(clave && typeof clave == "string"){
            const contraseñaHash = await bcrypt.hash(clave, process.env.SALT);
            usuarioAModificar.contraseña = contraseñaHash;
        }
        if(imagen && typeof imagen == "string"){
            usuarioAModificar.imagen = imagen;
        }
        await usuarioAModificar.save();
        res.status(200).json({mensaje: "Se modifico correctamente el usuario: " + usuarioAModificar.nombre});
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

const recuperarContraseña = async (req, res) => {
    const { email } = req.body; 
    console.log(email);

    try {
        const usuario = await Usuario.findOne({ where: { email } });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado con ese correo.' });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, 
                pass: process.env.EMAIL_PASS, 
            },
        });

      
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Recuperación de Contraseña',
            text: `Haz clic en el siguiente enlace para recuperar tu contraseña: \n\nhttp://localhost:3000/CambiarClave/${usuario.ID}`, 
        };

     
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: 'Error al enviar el correo.', error });
            }
            res.status(200).json({ message: 'Correo enviado exitosamente para recuperar tu contraseña.' });
        });

    } catch (error) {
        console.error('Error al recuperar la contraseña:', error);
        res.status(500).json({ message: 'Hubo un error al procesar la solicitud.' });
    }
};


module.exports = {
    getUsuarios,
    getUsuariobyID,
    loginUsuario,
    registrarUsuario,
    modificarUsuario,
    buscarUsuarioPorNombre,
    recuperarContraseña,
    traerUsuario,
};