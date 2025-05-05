async function getCoordinatesFromPlaceNameGoogle(placeName) {
  const apiKey = 'AIzaSyDwqQ1opp8hG88akJf2a78cYmKcQsb6D6c'; // Reemplaza con tu propia API key
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(placeName)}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      const lat = data.results[0].geometry.location.lat;
      const lng = data.results[0].geometry.location.lng;

      console.log(`Coordenadas de "${placeName}": Latitud: ${lat}, Longitud: ${lng}`);

      return { lat, lng };
    } else {
      throw new Error('No se encontraron coordenadas para ese lugar.');
    }
  } catch (error) {
    console.error('Error obteniendo coordenadas de Google Maps:', error);
    return null;
  }
}

export default getCoordinatesFromPlaceNameGoogle;
