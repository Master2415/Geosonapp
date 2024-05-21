const generarPuntos = (numeroDePuntos) => {
    const puntos = [];
    const x_max = bounds.getEast();
    const x_min = bounds.getWest();
    const y_max = bounds.getNorth();
    const y_min = bounds.getSouth();

    for( let i = 0; i < numeroDePuntos; i++ ) {
        const lat = y_min + (Math.random() * (y_max - y_min));
        const lng = x_min + (Math.random() * (x_max - x_min));
        puntos.push([lat, lng])
    }

    return puntos;
}