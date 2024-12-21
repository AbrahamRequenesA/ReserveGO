const fs = require('fs');
const path = require('path');

// Ruta donde se almacenarán las reservas en el servidor NFS
const NFS_BASE_PATH = 'Z:\\Reservas';  // Esta es la ruta de Windows, hay que cambiarla

// Función para guardar la reserva
const saveReservation = (reservationData) => {
    const { nombre, email, telefono, fecha, hora, personas, restaurante } = reservationData;
    const reservationFolder = path.join(NFS_BASE_PATH, restaurante);

    // Crear una carpeta para el restaurante si no existe
    if (!fs.existsSync(reservationFolder)) {
        fs.mkdirSync(reservationFolder);
    }

    // Generar un nombre único para el archivo de reserva (puedes usar un ID o un timestamp)
    const fileName = `reserva_${Date.now()}.json`;

    // Datos de la reserva a guardar
    const reservationFilePath = path.join(reservationFolder, fileName);

    const reservation = {
        nombre,
        email,
        telefono,
        fecha,
        hora,
        personas,
        restaurante,
        fechaReserva: new Date().toISOString(),
    };

    // Intentar guardar la reserva en un archivo JSON
    try {
        fs.writeFileSync(reservationFilePath, JSON.stringify(reservation, null, 2));
        console.log('Reserva guardada en:', reservationFilePath);  // Log de éxito
    } catch (err) {
        console.error('Error al guardar el archivo:', err);  // Log del error
        throw err;  // Lanza el error para que se maneje en el controlador
    }

    return reservation;
};


// Controlador para manejar la solicitud de reserva
const handleReservation = (req, res) => {
    try {
        const reservationData = req.body;

        // Guardar la reserva en el servidor NFS
        const reservation = saveReservation(reservationData);

        // Responder con un mensaje de éxito
        res.status(201).json({
            message: 'Reserva realizada con éxito.',
            reservation,
        });
    } catch (error) {
        console.error('Error al guardar la reserva:', error);
        res.status(500).json({
            message: 'Hubo un problema al guardar la reserva.',
            error: error.message,
        });
    }
};

module.exports = {
    handleReservation,
};
