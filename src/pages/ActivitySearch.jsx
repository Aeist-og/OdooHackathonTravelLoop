import { useState } from 'react';
import { searchActivities, getActivityTypes } from '../api/activities';
import { getPopularCities } from '../api/cities';
import { getActivityEmoji } from '../components/ActivityHelpers';
import { Search, MapPin } from 'lucide-react';

export default function ActivitySearch() {
  const [selectedCity, setSelectedCity] = useState(null);
  const [activityType, setActivityType] = useState('attraction');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const cities = getPopularCities().slice(0, 12);

  const handleCitySelect = async (city) => {
    setSelectedCity(city);
    setLoading(true);
    const acts = await searchActivities(city.latitude, city.longitude, activityType, 5000, 20);
    setResults(acts);
    setLoading(false);
  };

  const handleTypeChange = async (type) => {
    setActivityType(type);
    if (selectedCity) {
      setLoading(true);
      const acts = await searchActivities(selectedCity.latitude, selectedCity.longitude, type, 5000, 20);
      setResults(acts);
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🗺️ Activity Search</h1>
        <p>Find things to do near any destination.</p>
      </div>

      <div className="glass-card-static" style={{ marginBottom: 'var(--space-xl)' }}>
        <h4 style={{ marginBottom: 'var(--space-md)', color: 'var(--text-secondary)' }}>Select a City</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {cities.map(city => (
            <button key={city.id} className={`filter-chip ${selectedCity?.id === city.id ? 'active' : ''}`}
              onClick={() => handleCitySelect(city)}>
              {city.countryCode && <img src={`https://flagcdn.com/16x12/${city.countryCode.toLowerCase()}.png`} alt="" style={{ width: 14, borderRadius: 2 }} />}
              {city.name}
            </button>
          ))}
        </div>
      </div>

      {selectedCity && (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: 'var(--space-lg)' }}>
            {getActivityTypes().map(at => (
              <button key={at.value} className={`filter-chip ${activityType === at.value ? 'active' : ''}`}
                onClick={() => handleTypeChange(at.value)}>
                {at.emoji} {at.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-center"><div className="spinner" /></div>
          ) : results.length > 0 ? (
            <div className="grid grid-2 stagger">
              {results.map(act => (
                <div key={act.id} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px' }}>
                  <span style={{ fontSize: '1.5rem' }}>{getActivityEmoji(act.type)}</span>
                  <div style={{ flex: 1 }}>
                    <h5 style={{ fontSize: '0.95rem' }}>{act.name}</h5>
                    {act.address && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}><MapPin size={12} style={{ display: 'inline' }} /> {act.address}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state glass-card-static">
              <div className="empty-state-icon"><Search size={32} /></div>
              <h3>No results</h3>
              <p>No {activityType} activities found near {selectedCity.name}. Try another category.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
