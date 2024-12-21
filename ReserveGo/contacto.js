document.querySelector('.contacto-form form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const nombre = document.querySelector('#nombre').value;
    const email = document.querySelector('#email').value;
    const telefono = document.querySelector('#telefono').value;
    const asunto = document.querySelector('#asunto').value;
    const mensaje = document.querySelector('#mensaje').value;

    // Verificación de que todos los campos sean no vacíos
    if (!nombre || !email || !asunto || !mensaje) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, email, telefono, asunto, mensaje })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Mensaje enviado correctamente');
            // Limpiar el formulario
            document.querySelector('.contacto-form form').reset();
        } else {
            alert(data.message); // Mostrar el mensaje de error de la API
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Hubo un problema al enviar el mensaje.');
    }
});
