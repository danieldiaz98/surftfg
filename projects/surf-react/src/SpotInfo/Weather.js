async function getWeatherData(lat, lng) {
  const params = 'waveDirection,wavePeriod,waveHeight,windSpeed,windDirection';

  try {
    const response = await fetch(
      `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}&source=sg`,
      {
        headers: {
          'Authorization': 'a0deb85a-04f4-11f0-b8ac-0242ac130003-a0deb8be-04f4-11f0-b8ac-0242ac130003'
        }
      }
    );

    const data = await response.json();
    console.log("Respuesta completa:", data);

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
