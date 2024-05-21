const bounds = L.latLngBounds([
    [13.274277, -80.067026],
    [-5.100372, -65.924605],
]);

const pathDefecto = {
    color: 'black'
}

const pathGrupo =  {
    color: 'red'
}

const divIcon = L.divIcon({
    className: 'fa-solid fa-heart myDivIcon',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
})

const map = L.map('map', {
    minZoom:6,
    maxZoom:22,
    center: [4.881729, -73.437706],
    maxBounds: bounds
})

map.fitBounds(bounds);

const scale = L.control.scale({
    position: 'bottomright'
}).addTo(map)

const baseMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxNativeZoom: 19,
    maxZoom: 22,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const darkMap = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
	maxNativeZoom: 20,
    maxZoom: 22,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});

const group = L.featureGroup().addTo(map);

group.on('layeradd', (evento) => {
    const { layer } = evento;
    if(layer?.dragging){
        layer.setIcon(divIcon)
    }
    else {
        layer.setStyle(pathGrupo)
    }
})

const baseLayers = {
    "Streets": baseMap,
    "Dark": darkMap,
}

const overlays = {
    "Feature Group": group
}

const controlLayers = L.control.layers( baseLayers, overlays, {
    collapsed: false
} ).addTo(map);

const crearCapa = (puntos, type, grouped) => {
    let layer;

    if (type === 'marker') {
        layer = L.marker(puntos[0], { draggable: true, icon: L.divIcon({ className: 'fa-solid fa-circle', iconSize: [10, 10] }) });
    } else if (type === 'circleMarker') {
        layer = L.circleMarker(puntos[0], { ...pathDefecto });
    } else if (type === 'polygon') {
        const vertices = [
            [puntos[0].lat, puntos[0].lng],
            [puntos[0].lat, puntos[1].lng],
            [puntos[1].lat, puntos[1].lng],
            [puntos[1].lat, puntos[0].lng]
        ];
        layer = L.polygon(vertices, { ...pathDefecto, weight: 3, fillOpacity: 0.5 });
    } else if (type === 'polyline') {
        layer = L.polyline(puntos, { ...pathDefecto, weight: 3 });
    }

    if (grouped) {
        group.addLayer(layer);
    } else {
        layer.addTo(map);
        controlLayers.addOverlay(layer, type);
    }
    layer.bindTooltip(type);
    crearPopup(layer, grouped);
};

// Función auxiliar para generar puntos aleatorios alrededor de un punto central
const generarPuntos = (n, centro) => {
    const puntos = [];
    for (let i = 0; i < n; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const radius = Math.random() * 0.01; // Ajustar el radio según sea necesario
        const lat = centro.lat + radius * Math.cos(angle);
        const lng = centro.lng + radius * Math.sin(angle);
        puntos.push([lat, lng]);
    }
    return puntos;
};
const crearPopup = (layer, grouped) => {
    const popupContent = document.createElement('div');
    popupContent.className = 'popupContent';

    const cancelarBtn = document.createElement('button');
    cancelarBtn.className = 'cancelar';
    cancelarBtn.innerText = 'Cancelar';
    cancelarBtn.onclick = () => {
        if (grouped) {
            group.removeLayer(layer);
        } else {
            map.removeLayer(layer);
            controlLayers.removeLayer(layer);
        }
    };

    const procesoBtn = document.createElement('button');
    procesoBtn.className = 'proceso';
    procesoBtn.innerText = 'En proceso';
    // Lógica adicional para el botón "En proceso"

    popupContent.appendChild(cancelarBtn);
    popupContent.appendChild(procesoBtn);

    layer.bindPopup(popupContent);
};