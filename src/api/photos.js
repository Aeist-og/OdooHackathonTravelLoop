// Unsplash Source — Free, no API key needed (uses source.unsplash.com)
// For high-quality destination photos

const UNSPLASH_SOURCE = 'https://source.unsplash.com';

export function getCityPhoto(cityName, width = 800, height = 600) {
  return `${UNSPLASH_SOURCE}/${width}x${height}/?${encodeURIComponent(cityName + ' city skyline')}`;
}

export function getActivityPhoto(activityName, width = 600, height = 400) {
  return `${UNSPLASH_SOURCE}/${width}x${height}/?${encodeURIComponent(activityName + ' travel')}`;
}

export function getRandomTravelPhoto(width = 1200, height = 600) {
  return `${UNSPLASH_SOURCE}/${width}x${height}/?travel,destination,landscape`;
}

// Curated photo collections for destinations
const CITY_PHOTOS = {
  'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&h=500&fit=crop',
  'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=500&fit=crop',
  'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=500&fit=crop',
  'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=500&fit=crop',
  'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=500&fit=crop',
  'Rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&h=500&fit=crop',
  'Barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=500&fit=crop',
  'Bangkok': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&h=500&fit=crop',
  'Istanbul': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&h=500&fit=crop',
  'Singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=500&fit=crop',
  'Sydney': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&h=500&fit=crop',
  'Amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&h=500&fit=crop',
  'Mumbai': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=500&fit=crop',
  'Cairo': 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800&h=500&fit=crop',
  'Berlin': 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&h=500&fit=crop',
  'Lisbon': 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&h=500&fit=crop',
  'Seoul': 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=800&h=500&fit=crop',
  'Denpasar': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=500&fit=crop',
};

export function getCuratedCityPhoto(cityName) {
  return CITY_PHOTOS[cityName] || getCityPhoto(cityName);
}

export function getAllCuratedPhotos() {
  return CITY_PHOTOS;
}
