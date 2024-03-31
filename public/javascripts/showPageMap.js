mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: [longitude, latitude], // starting position [lng, lat]
  zoom: 7, // starting zoom
});

const marker = new mapboxgl.Marker()
  .setLngLat([longitude, latitude])
  .addTo(map);
const popup = new mapboxgl.Popup({ closeOnClick: false })
  .setLngLat([longitude, latitude])
  .setHTML(`<h6>${title}</h6><p>${locate}</p>`)
  .addTo(map);
