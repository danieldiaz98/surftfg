async function getCoordinatesFromPlaceNameGoogle(placeName) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(placeName)}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const lat = data.results[0].geometry.location.lat;
      const lng = data.results[0].geometry.location.lng;

      return { lat, lng };
    } else {
      throw new Error(`No se encontraron coordenadas para: ${placeName}`);
    }
  } catch (error) {
    console.error('Error obteniendo coordenadas de Google Maps:', error);
    return null;
  }
}
export default getCoordinatesFromPlaceNameGoogle;