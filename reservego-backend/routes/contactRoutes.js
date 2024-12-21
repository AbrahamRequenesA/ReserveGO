const express = require('express');
const router = express.Router();
const { sendContactMessage } = require('../controllers/contactController');

// Ruta para enviar el mensaje de contacto
router.post('/contact', sendContactMessage);

module.exports = router;
