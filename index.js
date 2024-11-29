const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

// Configura CORS para permitir todas las solicitudes desde cualquier origen
app.use(cors()); // Permite solicitudes de cualquier dominio por defecto

const PORT = 8080;
app.use(express.json());

app.get('/', (req, res) => {
    
    res.send('welcome to my server');
})

app.listen(PORT, () => {
    console.log('server running on port: ', PORT);
})

app.use('/api/usuarios', require('./routes/Usuario.js'));
app.use('/api/proyectos',require('./routes/Proyecto.js'));
app.use('/api/gastos', require('./routes/Gastos.js'));
app.use('/api/deudas', require('./routes/Deudas.js'));
  