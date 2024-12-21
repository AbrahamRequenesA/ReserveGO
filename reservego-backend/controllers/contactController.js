const fs = require('fs');
const path = require('path');

// Ruta base para los mensajes de contacto en el NFS
const NFS_CONTACT_PATH = 'Z:\\Contacto';

// Función para manejar el envío de un mensaje de contacto
function sendContactMessage(req, res) {
    const { nombre, email, telefono, asunto, mensaje } = req.body;

    // Validación de campos requeridos
    if (!nombre || !email || !asunto || !mensaje) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    const contactDir = path.join(NFS_CONTACT_PATH, email);

    try {
        // Verificar si la carpeta del usuario ya existe
        if (!fs.existsSync(contactDir)) {
            console.log('Carpeta del usuario no existe, creando...');
            fs.mkdirSync(contactDir, { recursive: true }); // Crear carpeta para el contacto
        } else {
            console.log('La carpeta del usuario ya existe.');
        }

        // Generar un nombre de archivo único para cada mensaje
        const messageId = Date.now(); // Utilizamos la fecha actual como ID único
        const messageFile = path.join(contactDir, `${messageId}.txt`);

        // Guardar el mensaje en un archivo
        const contactMessage = `Nombre: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono}\nAsunto: ${asunto}\nMensaje: ${mensaje}`;
        fs.writeFileSync(messageFile, contactMessage, 'utf8');

        console.log(`Mensaje guardado en: ${messageFile}`);

        return res.status(201).json({ message: 'Mensaje de contacto enviado correctamente.' });
    } catch (error) {
        console.error('Error al enviar el mensaje:', error.message);
        return res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
    }
}

module.exports = { sendContactMessage };
