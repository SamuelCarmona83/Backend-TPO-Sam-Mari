const express = require('express');
const deudaControlador = require('../controllers/DeudaControlador');
const router = express.Router();
const {validarJWT} = require('../middelwares/jwtValidador');

