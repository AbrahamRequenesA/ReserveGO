const express = require('express');
const router = express.Router();
const { handleReservation } = require('../controllers/reservationsController');

// Ruta para manejar la creación de reservas
router.post('/api/reservas', handleReservation);

module.exports = router;
