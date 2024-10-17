const express = require('express');
const {sequelize, Usuario} = require('./BD/bd.js'); //lo hizo chatgpt analizar luego este import supuestamente es para crear las tablas si no existe

const app = express();
const PORT = 8080;

app.get('/', (req, res) => {
    res.send('welcome to my server');
})

app.listen(PORT, () => {
    console.log('server running on port: ', PORT);
})

app.use('/api/usuario', require('./routes/Usuario.js'));
//crear la ruta proyectos 
