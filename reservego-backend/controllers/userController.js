// controllers/userController.js
const fs = require('fs');
const path = require('path');

// Ruta base del NFS (en Windows, la unidad montada Z:)
const NFS_BASE_PATH = 'Z:\\Usuarios';

// Función para registrar usuario
function registerUser(req, res) {
    const { nombre, email, password } = req.body;

    // Validación de campos requeridos
    if (!nombre || !email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    // Validación de longitud de contraseña
    if (password.length < 6) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    // Crear la carpeta del usuario
    const userDir = path.join(NFS_BASE_PATH, email);

    try {
        console.log(`Intentando crear carpeta en: ${userDir}`);

        // Verificar si la carpeta ya existe
        if (fs.existsSync(userDir)) {
            console.log('La carpeta ya existe.');
            return res.status(400).json({ message: 'El usuario ya está registrado.' });
        }

        // Crear la carpeta del usuario
        fs.mkdirSync(userDir, { recursive: true });
        console.log('Carpeta creada correctamente.');

        // Guardar los datos en archivos
        fs.writeFileSync(path.join(userDir, 'nombre.txt'), nombre, 'utf8');
        fs.writeFileSync(path.join(userDir, 'password.txt'), password, 'utf8');
        console.log('Archivos guardados correctamente.');

        // Respuesta de éxito
        return res.status(201).json({ message: 'Usuario registrado correctamente.' });
    } catch (error) {
        console.error('Error al registrar usuario:', error.message);
        return res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
    }
}

// Función para iniciar sesión
function loginUser(req, res) {
    const { email, password } = req.body;
    const userDir = path.join(NFS_BASE_PATH, email);

    try {
        if (!fs.existsSync(userDir)) {
            return res.status(401).json({ message: 'Usuario no encontrado.' });
        }

        const storedPassword = fs.readFileSync(path.join(userDir, 'password.txt'), 'utf8');
        const storedName = fs.readFileSync(path.join(userDir, 'nombre.txt'), 'utf8');

        if (storedPassword === password) {
            return res.status(200).json({ message: 'Inicio de sesión exitoso.', userName: storedName });
        } else {
            return res.status(401).json({ message: 'Credenciales incorrectas.' });
        }
    } catch (error) {
        console.error('Error al intentar iniciar sesión:', error.message);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
}

module.exports = { registerUser, loginUser };
