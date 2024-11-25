const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Deudas = sequelize.define('Deudas', {
        ID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        monto: {
            type: DataTypes.DECIMAL(15, 3),
            allowNull: false,
        }, 
        porcentaje: {
            type: DataTypes.DECIMAL(4, 3),
            allowNull: false,
        },
        imagen: DataTypes.STRING,
        pagada: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false, // Inicializa como no pagada por defecto
        },
    });

    return Deudas;
};