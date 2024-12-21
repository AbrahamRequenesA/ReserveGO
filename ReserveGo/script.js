
    // Verificar si el usuario está logueado
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');

    if (userName) {
        // Si el usuario está logueado, mostrar el nombre y el botón de cerrar sesión
        document.getElementById('user-name').textContent = `Bienvenido, ${userName}`;
        document.getElementById('logout-btn').style.display = 'inline-block';
        document.getElementById('login-link').style.display = 'none';
        document.getElementById('register-link').style.display = 'none';
    } else {
        // Si no está logueado, mostrar los enlaces de inicio de sesión y registro
        document.getElementById('login-link').style.display = 'inline-block';
        document.getElementById('register-link').style.display = 'inline-block';
    }

    // Funcionalidad para cerrar sesión
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        window.location.href = 'login.html'; // Redirigir al login
    });

