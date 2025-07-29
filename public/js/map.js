// public/js/map.js
document.addEventListener("DOMContentLoaded", function () {
  if (typeof coordinates !== "undefined" && coordinates) {
    const parsedCoords = JSON.parse(coordinates); // [lng, lat]
    const lat = parsedCoords[1];
    const lng = parsedCoords[0];

    const map = L.map('map').setView([lat, lng], 13);

    // Use OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Create custom red icon
    const redIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Add a red marker with coordinates in popup
    L.marker([lat, lng], { icon: redIcon }).addTo(map)
      .bindPopup(`${listingLocation}`)

      .openPopup();

  } else {
    console.error("Coordinates not found or invalid.");
  }
});
