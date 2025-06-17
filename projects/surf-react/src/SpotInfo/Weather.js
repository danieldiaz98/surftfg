async function getWeatherData(lat, lng) {
  const params = 'waveDirection,wavePeriod,waveHeight,windSpeed,windDirection';
  const apiKey = import.meta.env.VITE_STORMGLASS_API_KEY;
  try {
    const response = await fetch(
      `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}&source=sg`,
      {
        headers: {
          'Authorization': apiKey
        }
      }
    );

    const data = await response.json();

    if (!data.hours || data.hours.length === 0) {
      throw new Error("No hay datos disponibles para la ubicación y hora solicitadas.");
    }

    const lastHourData = data.hours[data.hours.length - 1];
    return lastHourData;

  } catch (error) {
    console.error('Error obteniendo datos meteorológicos:', error);
  }
}

export default getWeatherData;
