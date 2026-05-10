// GeoDB Cities API — Free tier via public endpoint
const GEODB_BASE = 'https://wft-geo-db.p.rapidapi.com/v1/geo';

// Using the free public endpoint (limited rate but no key needed)
const PUBLIC_GEODB = 'http://geodb-free-service.wirefreethought.com/v1/geo';

export async function searchCities(query, limit = 10) {
  if (!query || query.length < 2) return [];
  
  try {
    const res = await fetch(
      `${PUBLIC_GEODB}/cities?namePrefix=${encodeURIComponent(query)}&limit=${limit}&sort=-population&types=CITY`,
      { headers: { 'Accept': 'application/json' } }
    );
    
    if (!res.ok) throw new Error('GeoDB API error');
    
    const data = await res.json();
    return (data.data || []).map(city => ({
      id: city.id,
      name: city.name || city.city,
      country: city.country,
      countryCode: city.countryCode,
      region: city.region,
      latitude: city.latitude,
      longitude: city.longitude,
      population: city.population,
    }));
  } catch (err) {
    console.warn('GeoDB search failed, using fallback:', err.message);
    return getFallbackCities(query);
  }
}

export async function getCityDetails(cityId) {
  try {
    const res = await fetch(`${PUBLIC_GEODB}/cities/${cityId}`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) throw new Error('City details fetch failed');
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.warn('City details failed:', err.message);
    return null;
  }
}

export async function getNearbyCities(cityId, radius = 100, limit = 5) {
  try {
    const res = await fetch(
      `${PUBLIC_GEODB}/cities/${cityId}/nearbyCities?radius=${radius}&limit=${limit}&sort=-population`,
      { headers: { 'Accept': 'application/json' } }
    );
    if (!res.ok) throw new Error('Nearby cities fetch failed');
    const data = await res.json();
    return (data.data || []).map(c => ({
      id: c.id,
      name: c.name || c.city,
      country: c.country,
      countryCode: c.countryCode,
      latitude: c.latitude,
      longitude: c.longitude,
      population: c.population,
    }));
  } catch (err) {
    console.warn('Nearby cities failed:', err.message);
    return [];
  }
}

// Fallback popular cities for when API is rate-limited
function getFallbackCities(query) {
  const cities = [
    { id: 'fb-paris', name: 'Paris', country: 'France', countryCode: 'FR', latitude: 48.8566, longitude: 2.3522, population: 2161000 },
    { id: 'fb-london', name: 'London', country: 'United Kingdom', countryCode: 'GB', latitude: 51.5074, longitude: -0.1278, population: 8982000 },
    { id: 'fb-tokyo', name: 'Tokyo', country: 'Japan', countryCode: 'JP', latitude: 35.6762, longitude: 139.6503, population: 13960000 },
    { id: 'fb-nyc', name: 'New York', country: 'United States', countryCode: 'US', latitude: 40.7128, longitude: -74.006, population: 8336000 },
    { id: 'fb-dubai', name: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', latitude: 25.2048, longitude: 55.2708, population: 3331000 },
    { id: 'fb-rome', name: 'Rome', country: 'Italy', countryCode: 'IT', latitude: 41.9028, longitude: 12.4964, population: 2873000 },
    { id: 'fb-barcelona', name: 'Barcelona', country: 'Spain', countryCode: 'ES', latitude: 41.3874, longitude: 2.1686, population: 1621000 },
    { id: 'fb-bangkok', name: 'Bangkok', country: 'Thailand', countryCode: 'TH', latitude: 13.7563, longitude: 100.5018, population: 8281000 },
    { id: 'fb-istanbul', name: 'Istanbul', country: 'Turkey', countryCode: 'TR', latitude: 41.0082, longitude: 28.9784, population: 15463000 },
    { id: 'fb-singapore', name: 'Singapore', country: 'Singapore', countryCode: 'SG', latitude: 1.3521, longitude: 103.8198, population: 5686000 },
    { id: 'fb-sydney', name: 'Sydney', country: 'Australia', countryCode: 'AU', latitude: -33.8688, longitude: 151.2093, population: 5312000 },
    { id: 'fb-amsterdam', name: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', latitude: 52.3676, longitude: 4.9041, population: 872680 },
    { id: 'fb-mumbai', name: 'Mumbai', country: 'India', countryCode: 'IN', latitude: 19.076, longitude: 72.8777, population: 12442000 },
    { id: 'fb-jaipur', name: 'Jaipur', country: 'India', countryCode: 'IN', latitude: 26.9124, longitude: 75.7873, population: 3046163 },
    { id: 'fb-bangalore', name: 'Bangalore', country: 'India', countryCode: 'IN', latitude: 12.9716, longitude: 77.5946, population: 8443675 },
    { id: 'fb-mysore', name: 'Mysuru (Karnataka)', country: 'India', countryCode: 'IN', latitude: 12.2958, longitude: 76.6394, population: 920550 },
    { id: 'fb-cairo', name: 'Cairo', country: 'Egypt', countryCode: 'EG', latitude: 30.0444, longitude: 31.2357, population: 9540000 },
    { id: 'fb-berlin', name: 'Berlin', country: 'Germany', countryCode: 'DE', latitude: 52.52, longitude: 13.405, population: 3645000 },
    { id: 'fb-lisbon', name: 'Lisbon', country: 'Portugal', countryCode: 'PT', latitude: 38.7223, longitude: -9.1393, population: 505526 },
    { id: 'fb-seoul', name: 'Seoul', country: 'South Korea', countryCode: 'KR', latitude: 37.5665, longitude: 126.978, population: 9776000 },
    { id: 'fb-bali', name: 'Denpasar', country: 'Indonesia', countryCode: 'ID', latitude: -8.6705, longitude: 115.2126, population: 725314 },
  ];
  const q = query.toLowerCase();
  return cities.filter(c => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q));
}

export function getPopularCities() {
  return getFallbackCities('');
}
