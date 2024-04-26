document.addEventListener('DOMContentLoaded', function() {
    // Función para actualizar el valor mostrado cuando el control deslizante cambia
    function actualizarValor(sliderId) {
        var slider = document.getElementById(sliderId);
        slider.dataset.value = slider.value; // Actualiza el atributo data-value
    }

    // Agregar eventos de escucha para los controles deslizantes
    document.getElementById('dificultad').addEventListener('input', function() {
        actualizarValor('dificultad');
    });

    document.getElementById('volumen').addEventListener('input', function() {
        actualizarValor('volumen');
    });

    document.getElementById('musica').addEventListener('input', function() {
        actualizarValor('musica');
    });

    // Actualizar los valores iniciales al cargar la página
    actualizarValor('dificultad');
    actualizarValor('volumen');
    actualizarValor('musica');

    // Obtener el parámetro "from" de la URL
    const params = new URLSearchParams(window.location.search);
    const fromPage = params.get('from');

    // Función para redirigir según la página de origen
    function redirectToOriginPage() {
        if (fromPage === 'index') {
            window.location.href = 'index.html';
        } else if (fromPage === 'pausa') {
            window.location.href = 'Pausa.html';
        } else {
            // Por defecto, volver al index.html
            window.location.href = 'index.html';
        }
    }

    // Asignar la función al botón "Volver"
    document.getElementById('volverBtn').addEventListener('click', redirectToOriginPage);
});
