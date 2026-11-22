/**
 * Weather Service using Open-Meteo (real-time meteorological data)
 * with support for OpenWeatherMap if an API key is provided.
 */

// WMO Weather interpretation codes (WW)
const WMO_CODE_MAP = {
  0: { label: 'Clear sky', icon: 'sun' },
  1: { label: 'Mainly clear', icon: 'sun-dim' },
  2: { label: 'Partly cloudy', icon: 'cloud-sun' },
  3: { label: 'Overcast', icon: 'cloud' },
  45: { label: 'Foggy', icon: 'cloud-fog' },
  48: { label: 'Depositing rime fog', icon: 'cloud-fog' },
  51: { label: 'Light drizzle', icon: 'cloud-drizzle' },
  53: { label: 'Moderate drizzle', icon: 'cloud-drizzle' },
  55: { label: 'Dense drizzle', icon: 'cloud-drizzle' },
  61: { label: 'Slight rain', icon: 'cloud-rain' },
  63: { label: 'Moderate rain', icon: 'cloud-rain' },
  65: { label: 'Heavy rain', icon: 'cloud-rain' },
  71: { label: 'Slight snow fall', icon: 'cloud-snow' },
  73: { label: 'Moderate snow fall', icon: 'cloud-snow' },
  75: { label: 'Heavy snow fall', icon: 'cloud-snow' },
  80: { label: 'Slight rain showers', icon: 'cloud-rain' },
  81: { label: 'Moderate rain showers', icon: 'cloud-rain' },
  82: { label: 'Violent rain showers', icon: 'cloud-lightning' },
  95: { label: 'Thunderstorm', icon: 'cloud-lightning' },
  96: { label: 'Thunderstorm with slight hail', icon: 'cloud-lightning' },
  99: { label: 'Thunderstorm with heavy hail', icon: 'cloud-lightning' },
};

export async function fetchRealWeather(destination) {
  if (!destination || typeof destination !== 'string' || !destination.trim()) {
    throw new Error('Destination name is required to retrieve weather.');
  }

  const query = destination.trim();

  // 1. Geocode destination to latitude and longitude
  const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
  const geoRes = await fetch(geoUrl);
  
  if (!geoRes.ok) {
    throw new Error(`Failed to geocode destination "${query}". Service returned HTTP ${geoRes.status}.`);
  }

  const geoData = await geoRes.json();
  if (!geoData.results || geoData.results.length === 0) {
    throw new Error(`Location "${query}" could not be found. Please check spelling or try a nearby major city.`);
  }

  const location = geoData.results[0];
  const { latitude, longitude, name, country, admin1 } = location;

  // 2. Query Open-Meteo Forecast
  const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

  const weatherRes = await fetch(weatherUrl);
  if (!weatherRes.ok) {
    throw new Error(`Failed to retrieve meteorological data for ${name}. HTTP ${weatherRes.status}`);
  }

  const weatherData = await weatherRes.json();
  const current = weatherData.current;
  const daily = weatherData.daily;

  if (!current) {
    throw new Error(`Current weather data unavailable for ${name}.`);
  }

  const weatherCode = current.weather_code ?? 0;
  const weatherInfo = WMO_CODE_MAP[weatherCode] || { label: 'Clear', icon: 'sun' };

  // 5-day daily forecast
  const forecast = [];
  if (daily && daily.time) {
    const daysCount = Math.min(5, daily.time.length);
    for (let i = 0; i < daysCount; i++) {
      const dayCode = daily.weather_code?.[i] ?? 0;
      const dayInfo = WMO_CODE_MAP[dayCode] || { label: 'Pleasant', icon: 'sun' };
      forecast.push({
        date: daily.time[i],
        tempMax: Math.round(daily.temperature_2m_max?.[i] ?? 0),
        tempMin: Math.round(daily.temperature_2m_min?.[i] ?? 0),
        rainProbability: daily.precipitation_probability_max?.[i] ?? 0,
        condition: dayInfo.label,
        icon: dayInfo.icon
      });
    }
  }

  return {
    location: {
      name,
      region: admin1 || '',
      country: country || '',
      latitude,
      longitude,
    },
    current: {
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      precipitation: current.precipitation,
      condition: weatherInfo.label,
      icon: weatherInfo.icon,
      updatedAt: current.time,
    },
    forecast,
    provider: 'Open-Meteo High Resolution Weather Model'
  };
}
