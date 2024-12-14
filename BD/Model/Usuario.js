const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {

    const Usuario = sequelize.define('Usuario',
        {
            ID: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            nombre: DataTypes.STRING,
            imagen: DataTypes.STRING,
            email: DataTypes.STRING,
            contraseña: DataTypes.STRING,
            edad: DataTypes.INTEGER,
            fechaNacimiento: DataTypes.STRING
        }
    );

    return Usuario;
}
