import { getCuratedCityPhoto } from '../api/photos';
import { MapPin, Users, Plus } from 'lucide-react';
import './CityCard.css';

export default function CityCard({ city, onAdd, compact = false }) {
  const photo = getCuratedCityPhoto(city.name);

  const formatPopulation = (pop) => {
    if (!pop) return '';
    if (pop >= 1000000) return `${(pop / 1000000).toFixed(1)}M`;
    if (pop >= 1000) return `${(pop / 1000).toFixed(0)}K`;
    return pop.toString();
  };

  if (compact) {
    return (
      <div className="city-card-compact glass-card" id={`city-compact-${city.id}`}>
        <img src={photo} alt={city.name} className="city-compact-img" loading="lazy" />
        <div className="city-compact-info">
          <h5>{city.name}</h5>
          <p><MapPin size={12} /> {city.country}</p>
        </div>
        {onAdd && (
          <button className="btn btn-primary btn-sm" onClick={() => onAdd(city)}>
            <Plus size={14} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="city-card glass-card" id={`city-card-${city.id}`}>
      <div className="city-card-image">
        <img src={photo} alt={city.name} loading="lazy" />
        <div className="city-card-gradient" />
        <div className="city-card-info-overlay">
          <h3>{city.name}</h3>
          <p className="city-country">
            {city.countryCode && (
              <img
                src={`https://flagcdn.com/20x15/${city.countryCode.toLowerCase()}.png`}
                alt={city.country}
                className="country-flag"
              />
            )}
            {city.country}
          </p>
        </div>
      </div>
      <div className="city-card-body">
        <div className="city-card-stats">
          {city.population && (
            <div className="city-stat">
              <Users size={14} />
              <span>{formatPopulation(city.population)}</span>
            </div>
          )}
          {city.region && (
            <div className="city-stat">
              <MapPin size={14} />
              <span>{city.region}</span>
            </div>
          )}
        </div>
        {onAdd && (
          <button className="btn btn-primary btn-sm" onClick={() => onAdd(city)} id={`add-city-${city.id}`}>
            <Plus size={14} /> Add to Trip
          </button>
        )}
      </div>
    </div>
  );
}
