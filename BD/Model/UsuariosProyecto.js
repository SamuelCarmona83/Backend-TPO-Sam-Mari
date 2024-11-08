const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const UsuarioProyecto = sequelize.define('UsuarioProyecto', 
    {
        usuarioID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Usuarios',     // Nombre de la tabla de usuarios
                key: 'id'              // Columna a la que hace referencia en Usuarios
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        proyectoID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Proyectos',    // Nombre de la tabla de proyectos
                key: 'id'              // Columna a la que hace referencia en Proyectos
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        }
    });

    return UsuarioProyecto;
};
