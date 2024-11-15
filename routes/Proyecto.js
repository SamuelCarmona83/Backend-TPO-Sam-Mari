const { Router } = require('express');
const ProyectoControlador = require('../controllers/ProyectoControlador');
const Proyecto = require('../BD/Model/Proyecto');

const router = Router();

router.get('/', ProyectoControlador.getProyectos);
router.get('/:id', ProyectoControlador.getProyecto);
router.post('/crearProyecto', ProyectoControlador.crearProyecto);
router.post('/editarProyecto', ProyectoControlador.editarProyecto);



module.exports = router;