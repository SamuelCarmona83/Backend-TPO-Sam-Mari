const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
require('dotenv').config();

// conectar la base de datos //
    const sequelize = new Sequelize(
        process.env.DB_NAME || 'example', // nombre de la base de datos
        process.env.DB_USER || 'postgres', // usuario
        process.env.DB_PASSWORD || 'postgres', // contraseña
        {
            host: process.env.DB_HOST || 'localhost', // Cambia 'localhost' si tu servidor no está en la misma máquina
            dialect: 'postgres',
            port: process.env.DB_PORT || 5432,
            dialectOptions: {
                ssl: process.env.DB_SSL === 'true' ? {
                    require: true,
                    rejectUnauthorized: false
                } : false
            },
            pool: {
                max: 20,
                min: 0,
                acquire: 200000, // tiempo máximo para conectar
                idle: 10000, // tiempo de espera antes de cerrar conexión inactiva
            },
            logging: false,
        }
    );

const UsuarioModel = require('./Model/Usuario');
const ProyectoModel = require('./Model/Proyecto');
const UsuarioProyectoModel = require('./Model/UsuariosProyecto');
const GastoModel = require('./Model/Gasto');
const DeudaModelo = require('./Model/Deuda');
const { hash } = require('bcrypt');

const Proyecto = ProyectoModel(sequelize, Sequelize);
const Usuario = UsuarioModel(sequelize, Sequelize);
const UsuarioProyecto = UsuarioProyectoModel(sequelize, Sequelize);
const Gastos = GastoModel(sequelize, Sequelize);
const Deudas = DeudaModelo(sequelize, Sequelize);


Usuario.hasMany(Proyecto, {
    foreignkey: 'usuarioAdmin',
    as: 'Proyectos administrados',
    onDelete: 'CASCADE'
});

Proyecto.belongsTo(Usuario, {
    foreignkey: 'usuarioAdmin',
    as: 'administrador'
});

//          Relaciones con la tabla de Usuario Proyecto          //
Usuario.belongsToMany(Proyecto, { through: UsuarioProyecto });
Proyecto.belongsToMany(Usuario, { through: UsuarioProyecto });

//          Relaciones con la tabla de gastos           //
Usuario.hasMany(Gastos, { foreignKey: 'usuarioID', as: 'Gastos' });
Proyecto.hasMany(Gastos, { foreignKey: 'proyectoID', as: 'Gastos' });
Gastos.belongsTo(Usuario, { foreignKey: 'usuarioID', as: 'Usuario' });
Gastos.belongsTo(Proyecto, { foreignKey: 'proyectoID', as: 'Proyecto' });
Gastos.hasMany(Deudas, {foreignKey: 'gastoID', as: 'deudasGeneradas' });

//          Relaciones con la tabla de Deudas           //
Proyecto.hasMany(Deudas, { foreignKey: 'proyectoId', as: 'deudas' });
Deudas.belongsTo(Proyecto, { foreignKey: 'proyectoId', as: 'proyecto' });
Usuario.hasMany(Deudas, { foreignKey: 'deudorId', as: 'deudasComoDeudor' });
Deudas.belongsTo(Usuario, { foreignKey: 'deudorId', as: 'deudor' });
Usuario.hasMany(Deudas, { foreignKey: 'cobradorId', as: 'deudasComoCobrador' });
Deudas.belongsTo(Usuario, { foreignKey: 'cobradorId', as: 'cobrador' });
Deudas.belongsTo(Gastos, {foreignKey: 'gastoID', as: 'gastoRelacionado' });

const generarsalt = async () => {
    const newSalt = await bcrypt.genSalt(10); // Genera un nuevo salt
    return newSalt;
}

sequelize.sync({
    alter: true
})
    .then( async () => {
        console.log('Database & tables created!');
        const salt = await generarsalt();
        console.log('NuevoSalt: ' + salt);
    })
    .catch(err => {
        console.log('Error: ', err);
    });

module.exports = {
    sequelize,
    Usuario,
    Proyecto,
    UsuarioProyecto,
    Gastos,
    Deudas
};