const formRegistro = document.querySelector('.registro-form');

formRegistro.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.querySelector('#nombre').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const confirmPassword = document.querySelector('#confirm-password').value;

    // Verificación de que las contraseñas coincidan
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    try {
        // Verificación de que todos los campos son no vacíos
        if (!nombre || !email || !password) {
            alert('Todos los campos son obligatorios.');
            return;
        }

        const response = await fetch('http://localhost:3000/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Usuario registrado correctamente');
            window.location.href = 'login.html';  
        } else {
            alert(data.message);  // Mostrar el mensaje de error de la API
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Hubo un problema al registrar el usuario');
    }
});
