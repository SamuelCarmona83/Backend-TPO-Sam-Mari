const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Proyecto = sequelize.define('Proyecto', {
        ID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false, 
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: true, 
        },
        usuarioAdmin: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Usuarios', 
                key: 'ID',         
            },
            allowNull: false, 
        },
    });

    return Proyecto;
};


