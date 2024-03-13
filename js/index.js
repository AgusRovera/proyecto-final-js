function registrarUsuario() {
    // Get the form element with the ID 'register'
    const formulario = document.getElementById('register');

    // Add a submit event listener to the form
    formulario.addEventListener('submit', (e) => {
        // Prevent the default form submission behavior
        e.preventDefault();

        // Get the form elements with the specified IDs
        const user = document.getElementById('usrR'),
            nombre = document.getElementById('nombreR'),
            apellido = document.getElementById('apellidoR'),
            email = document.getElementById('emailR'),
            contraseña = document.getElementById('passR1'),
            repetirContraseña = document.getElementById('passR2');

        // Log the values of the password fields to the console
        console.log(contraseña.value);
        console.log(repetirContraseña.value);

        // Check if any of the form fields are empty
        if (nombre.value == '' || apellido.value == '' || email.value == '' || contraseña.value == '' || repetirContraseña.value == '') {
            // If any form field is empty, show an alert and return
            alert('Por favor, completa todos los campos del formulario.');
            return;
        }

        // Check if the passwords match
        if (contraseña.value !== repetirContraseña.value) {
            // If the passwords do not match, show an alert and return
            alert('Las contraseñas no coinciden.');
            return;
        }

        // Create an object to store the user data
        const datosUsuario = { user: user.value, nombre: nombre.value, apellido: apellido.value, email: email.value, contraseña: contraseña.value };

        // Store the user data in session storage
        sessionStorage.setItem('nuevoRegistro', JSON.stringify(datosUsuario));

        // Show an alert to indicate successful registration
        alert('¡Registro exitoso!');

        // Redirect to the 'index.html' page
        window.location.href = './index.html';
    });
}