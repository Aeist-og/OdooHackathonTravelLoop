// Overpass API (OpenStreetMap) — Completely free, no key needed
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

const ACTIVITY_TYPES = {
  restaurant: '["amenity"="restaurant"]',
  cafe: '["amenity"="cafe"]',
  museum: '["tourism"="museum"]',
  hotel: '["tourism"="hotel"]',
  attraction: '["tourism"="attraction"]',
  park: '["leisure"="park"]',
  beach: '["natural"="beach"]',
  viewpoint: '["tourism"="viewpoint"]',
  monument: '["historic"="monument"]',
  temple: '["amenity"="place_of_worship"]',
  shopping: '["shop"="mall"]',
  nightlife: '["amenity"="nightclub"]',
};

export async function searchActivities(lat, lon, type = 'attraction', radius = 5000, limit = 20) {
  const filter = ACTIVITY_TYPES[type] || ACTIVITY_TYPES.attraction;
  
  const query = `
    [out:json][timeout:15];
    (
      node${filter}(around:${radius},${lat},${lon});
      way${filter}(around:${radius},${lat},${lon});
    );
    out center ${limit};
  `;

  try {
    const res = await fetch(OVERPASS_URL, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (!res.ok) throw new Error('Overpass API error');

    const data = await res.json();
    return (data.elements || []).map(el => ({
      id: el.id,
      name: el.tags?.name || el.tags?.['name:en'] || 'Unnamed Place',
      type: type,
      category: el.tags?.tourism || el.tags?.amenity || el.tags?.leisure || el.tags?.historic || type,
      lat: el.lat || el.center?.lat,
      lon: el.lon || el.center?.lon,
      address: el.tags?.['addr:street'] ? `${el.tags['addr:street']} ${el.tags['addr:housenumber'] || ''}`.trim() : '',
      website: el.tags?.website || '',
      phone: el.tags?.phone || '',
      opening_hours: el.tags?.opening_hours || '',
      wheelchair: el.tags?.wheelchair || '',
      cuisine: el.tags?.cuisine || '',
    })).filter(a => a.name !== 'Unnamed Place');
  } catch (err) {
    console.warn('Overpass search failed:', err.message);
    return getFallbackActivities(type);
  }
}

export function getActivityTypes() {
  return Object.keys(ACTIVITY_TYPES).map(key => ({
    value: key,
    label: key.charAt(0).toUpperCase() + key.slice(1),
    emoji: getActivityEmoji(key),
  }));
}

function getActivityEmoji(type) {
  const map = {
    restaurant: '🍽️', cafe: '☕', museum: '🏛️', hotel: '🏨',
    attraction: '⭐', park: '🌳', beach: '🏖️', viewpoint: '🌄',
    monument: '🗿', temple: '⛩️', shopping: '🛍️', nightlife: '🌙',
  };
  return map[type] || '📍';
}

function getFallbackActivities(type) {
  return [
    { id: 'fa-1', name: 'Local Museum', type, category: type, lat: 0, lon: 0 },
    { id: 'fa-2', name: 'City Park', type, category: type, lat: 0, lon: 0 },
    { id: 'fa-3', name: 'Historic Center', type, category: type, lat: 0, lon: 0 },
  ];
}
