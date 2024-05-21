let puntos = [];
const maxPuntos = 2;


btn.addEventListener('click', () => {
    const { value } = select;
    const { checked } = checkbox;
    if (value) {
        // Limpia cualquier selección previa
        map.off('click');
        puntos = [];
        
        // Marca el botón como activo
        btn.classList.add('button-active');

        // Agrega un listener para el clic en el mapa
        map.on('click', (e) => {
            // Obtiene las coordenadas donde se hizo clic
            const latlng = e.latlng;
            puntos.push(latlng);

            if (puntos.length === maxPuntos || (value === 'marker' || value === 'circleMarker')) {
                // Crea la capa en las coordenadas especificadas
                crearCapa(puntos, value, checked);

                // Desactiva el listener después de que se ha creado la capa
                map.off('click');
                
                // Desmarca el botón después de crear la capa
                btn.classList.remove('button-active');
            }
        });
    }
});