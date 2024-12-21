const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const contactRoutes = require('./routes/contactRoutes');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);
app.use('/api', contactRoutes);  // Registrar la nueva ruta de contacto

// Nueva ruta para las reservas
app.post('/api/reservations', (req, res) => {
    const { nombre, email, fecha, hora, personas } = req.body;

    if (!nombre || !email || !fecha || !hora || !personas) {
        return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    }

    // Ruta donde se guardarán las reservas
    const NFS_BASE_PATH = 'Z:\\Reservas';  

    // Crear carpeta para el restaurante si no existe
    const reservationFolder = path.join(NFS_BASE_PATH, nombre);
    if (!fs.existsSync(reservationFolder)) {
        console.log('Creando carpeta para la reserva:', reservationFolder);  // Log de creación de carpeta
        fs.mkdirSync(reservationFolder, { recursive: true });
    }

    // Crear archivo de reserva con datos
    const fileName = `reserva_${Date.now()}.json`;
    const reservationFilePath = path.join(reservationFolder, fileName);

    const reservation = {
        nombre,
        email,
        fecha,
        hora,
        personas,
        fechaReserva: new Date().toISOString()
    };

    // Guardar la reserva en un archivo JSON
    fs.writeFileSync(reservationFilePath, JSON.stringify(reservation, null, 2));
    console.log('Reserva guardada en el archivo:', reservationFilePath);  // Log de creación de archivo

    return res.status(201).json({
        message: 'Reserva confirmada',
        reservation
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
