// Open-Meteo API — Completely free, no API key needed
// https://open-meteo.com/

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function getWeather(lat, lon) {
  try {
    const res = await fetch(
      `${BASE_URL}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&timezone=auto&forecast_days=7`
    );
    if (!res.ok) throw new Error('Weather API error');
    const data = await res.json();

    return {
      current: {
        temp: data.current?.temperature_2m,
        humidity: data.current?.relative_humidity_2m,
        weatherCode: data.current?.weather_code,
        windSpeed: data.current?.wind_speed_10m,
        description: getWeatherDescription(data.current?.weather_code),
        icon: getWeatherIcon(data.current?.weather_code),
      },
      forecast: (data.daily?.time || []).map((date, i) => ({
        date,
        tempMax: data.daily.temperature_2m_max[i],
        tempMin: data.daily.temperature_2m_min[i],
        weatherCode: data.daily.weather_code[i],
        precipProb: data.daily.precipitation_probability_max[i],
        description: getWeatherDescription(data.daily.weather_code[i]),
        icon: getWeatherIcon(data.daily.weather_code[i]),
      })),
    };
  } catch (err) {
    console.warn('Weather fetch failed:', err.message);
    return null;
  }
}

function getWeatherDescription(code) {
  const descriptions = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Icy fog', 51: 'Light drizzle', 53: 'Drizzle',
    55: 'Heavy drizzle', 56: 'Freezing drizzle', 57: 'Heavy freezing drizzle',
    61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 66: 'Freezing rain',
    67: 'Heavy freezing rain', 71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
    77: 'Snow grains', 80: 'Light showers', 81: 'Showers', 82: 'Heavy showers',
    85: 'Light snow showers', 86: 'Heavy snow showers', 95: 'Thunderstorm',
    96: 'Thunderstorm with hail', 99: 'Heavy thunderstorm with hail',
  };
  return descriptions[code] || 'Unknown';
}

function getWeatherIcon(code) {
  if (code === 0) return '☀️';
  if (code <= 2) return '⛅';
  if (code === 3) return '☁️';
  if (code <= 48) return '🌫️';
  if (code <= 57) return '🌦️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '🌨️';
  if (code <= 82) return '🌧️';
  if (code <= 86) return '🌨️';
  return '⛈️';
}
