async function getCoordinatesFromPlaceNameGoogle(placeName) {
  const apiKey = 'AIzaSyDoc4OW1DbayNM87H7QX5LGiwxouWZDzSw'; // Asegúrate de proteger esta clave en producción
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(placeName)}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const lat = data.results[0].geometry.location.lat;
      const lng = data.results[0].geometry.location.lng;

      console.log(`Coordenadas de "${placeName}":`);
      console.log(`Latitud: ${lat}, Longitud: ${lng}`);

      return { lat, lng };
    } else {
      throw new Error(`No se encontraron coordenadas para: ${placeName}`);
    }
  } catch (error) {
    console.error('Error obteniendo coordenadas de Google Maps:', error);
    return null;
  }
}
getCoordinatesFromPlaceNameGoogle("El Frontón, Gáldar, Gran Canaria, España")
export default getCoordinatesFromPlaceNameGoogle;