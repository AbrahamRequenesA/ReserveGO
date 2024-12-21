// login.js
document.querySelector('.login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Inicio de sesión exitoso.") {
            // Guardar datos del usuario en localStorage
            localStorage.setItem('userName', data.userName);  // Asegúrate de que data.userName esté disponible
            localStorage.setItem('userEmail', email);
            window.location.href = 'index.html';  // Redirigir al index
        } else {
            alert('Credenciales incorrectas');
        }
    })
    .catch(error => console.error('Error:', error));
});
