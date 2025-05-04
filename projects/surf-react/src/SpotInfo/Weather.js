async function getWeatherData(lat, lng) {
    const params = 'windSpeed,airTemperature,waveHeight'; // Puedes añadir más parámetros
  
    try {
      const response = await fetch(`https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}`, {
        headers: {
          'Authorization': 'a0deb85a-04f4-11f0-b8ac-0242ac130003-a0deb8be-04f4-11f0-b8ac-0242ac130003'
        }
      });
  
      const data = await response.json();
      console.log('Datos meteorológicos:', data.hours);
      return data;
    } catch (error) {
      console.error('Error obteniendo datos meteorológicos:', error);
    }
  }
  export default getWeatherData;
  //Ejemplo de llamada a la función con coordenadas de "Playa de Melenara" obtenidas a través Location.js
  getWeatherData(28.1258699,-15.5847224);
  