export function getActivityEmoji(type) {
  const map = {
    restaurant: '🍽️', cafe: '☕', museum: '🏛️', hotel: '🏨',
    attraction: '⭐', park: '🌳', beach: '🏖️', viewpoint: '🌄',
    monument: '🗿', temple: '⛩️', shopping: '🛍️', nightlife: '🌙',
    transport: '✈️', food: '🍕', sightseeing: '📸', adventure: '🧗',
    relaxation: '🧘', culture: '🎭', entertainment: '🎬', sports: '⚽',
  };
  return map[type] || '📍';
}

export function getActivityColor(type) {
  const map = {
    restaurant: '#EF4444',
    cafe: '#F59E0B',
    museum: '#8B5CF6',
    hotel: '#06B6D4',
    attraction: '#F59E0B',
    park: '#10B981',
    beach: '#3B82F6',
    viewpoint: '#F97316',
    monument: '#A855F7',
    temple: '#EC4899',
    shopping: '#14B8A6',
    nightlife: '#6366F1',
  };
  return map[type] || '#64748B';
}
