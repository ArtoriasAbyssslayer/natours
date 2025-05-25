/* eslint-disable */
export const displayMap = (locations) => {
  const map = L.map('map', {
    center: [20, 0], // Start from a distant/global view
    zoom: 2, // Zoomed out
    zoomControl: false,
    zoomScroll: false,
    zoomAnimation: true,
  });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const points = [];
  locations.forEach((loc) => {
    points.push([loc.coordinates[1], loc.coordinates[0]]);
    L.marker([loc.coordinates[1], loc.coordinates[0]])
      .addTo(map)
      .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, {
        autoClose: false,
      })
      .openPopup();
  });

  const bounds = L.latLngBounds(points).pad(0.5);
  const polyline = L.polyline(points, {
    color: 'green',
    weight: 2,
    renderer: L.canvas(),
  }).addTo(map);

  map.on('zoomed', () => {
    const zoom = map.getZoom();
    polyline.setStyle({ weight: Math.max(1, 6 - zoom) });
  });
  map.flyToBounds(bounds, {
    duration: 1.5,
  });

  map.scrollWheelZoom.disable();
};
