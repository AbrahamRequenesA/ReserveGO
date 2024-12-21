// Agregar un evento de submit para enviar los datos al backend
document.getElementById('reservation-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = document.getElementById('reservation-name').value;
    const email = document.getElementById('reservation-email').value;
    const fecha = document.getElementById('reservation-date').value;
    const hora = document.getElementById('reservation-time').value;
    const personas = document.getElementById('people-count').value;

    // Mostrar los datos en la consola para asegurarnos de que se están capturando correctamente
    console.log('Datos de la reserva:', { nombre, email, fecha, hora, personas });

    const reservationData = {
        nombre,
        email,
        fecha,
        hora,
        personas
    };

    fetch('http://localhost:3000/api/reservations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservationData)
    })
    .then(response => {
        console.log('Respuesta del servidor:', response);  // Log de la respuesta
        return response.json();
    })
    .then(data => {
        console.log('Datos recibidos del servidor:', data);  // Log de los datos recibidos
        if (data.message === 'Reserva confirmada') {
            alert('Reserva confirmada: ' + data.reservation.nombre);
            // Redirigir al usuario al index.html después de la reserva confirmada
            window.location.href = 'index.html';
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error al realizar la reserva:', error);
        alert('Hubo un problema al confirmar la reserva.');
    });
});
