import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { searchCities } from '../api/cities';
import { MapPin, Calendar, FileText, PlusCircle, Search, X } from 'lucide-react';
import './CreateTrip.css';

export default function CreateTrip() {
  const navigate = useNavigate();
  const { addTrip } = useTrips();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [destination, setDestination] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState('');

  const debounce = (fn, ms) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  };

  const fetchCities = useCallback(
    debounce(async (q) => {
      if (q.length < 2) { setCitySuggestions([]); return; }
      const results = await searchCities(q, 8);
      setCitySuggestions(results);
      setShowSuggestions(true);
    }, 300),
    []
  );

  useEffect(() => {
    fetchCities(cityQuery);
  }, [cityQuery]);

  const selectCity = (city) => {
    setDestination(city.name);
    setCityQuery(city.name);
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('Trip name is required'); return; }
    if (!startDate) { setError('Start date is required'); return; }
    if (!endDate) { setError('End date is required'); return; }
    if (new Date(endDate) < new Date(startDate)) { setError('End date must be after start date'); return; }

    const trip = addTrip({
      name: name.trim(),
      description: description.trim(),
      startDate,
      endDate,
      destination: destination || cityQuery,
    });

    navigate(`/itinerary/${trip.id}/edit`);
  };

  return (
    <div className="page-container">
      <div className="create-trip-wrapper">
        <div className="page-header">
          <h1>✈️ Create New Trip</h1>
          <p>Fill in the details below to start planning your adventure.</p>
        </div>

        <form className="create-trip-form glass-card-static" onSubmit={handleSubmit} id="create-trip-form">
          {error && <div className="auth-error animate-fade-in">{error}</div>}

          <div className="form-group">
            <label className="form-label"><FileText size={14} /> Trip Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g., European Summer 2026"
              value={name}
              onChange={e => setName(e.target.value)}
              id="trip-name"
            />
          </div>

          <div className="form-group">
            <label className="form-label"><MapPin size={14} /> Destination</label>
            <div className="city-search-wrapper">
              <div className="input-with-icon">
                <Search size={16} className="input-icon" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search for a city..."
                  value={cityQuery}
                  onChange={e => { setCityQuery(e.target.value); setDestination(''); }}
                  onFocus={() => citySuggestions.length > 0 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  id="trip-destination"
                />
                {cityQuery && (
                  <button type="button" className="pw-toggle" onClick={() => { setCityQuery(''); setDestination(''); setCitySuggestions([]); }}>
                    <X size={16} />
                  </button>
                )}
              </div>
              {showSuggestions && citySuggestions.length > 0 && (
                <div className="city-suggestions animate-scale-in">
                  {citySuggestions.map(city => (
                    <button
                      key={city.id}
                      type="button"
                      className="city-suggestion-item"
                      onClick={() => selectCity(city)}
                    >
                      {city.countryCode && (
                        <img
                          src={`https://flagcdn.com/20x15/${city.countryCode.toLowerCase()}.png`}
                          alt=""
                          className="suggestion-flag"
                        />
                      )}
                      <div className="suggestion-info">
                        <span className="suggestion-name">{city.name}</span>
                        <span className="suggestion-country">{city.country}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label"><Calendar size={14} /> Start Date</label>
              <input
                type="date"
                className="form-input"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                id="trip-start-date"
              />
            </div>
            <div className="form-group">
              <label className="form-label"><Calendar size={14} /> End Date</label>
              <input
                type="date"
                className="form-input"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                min={startDate}
                id="trip-end-date"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description (optional)</label>
            <textarea
              className="form-input"
              placeholder="What's this trip about? Any special plans?"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              id="trip-description"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" id="create-trip-submit" style={{ width: '100%' }}>
            <PlusCircle size={18} /> Create Trip & Build Itinerary
          </button>
        </form>
      </div>
    </div>
  );
}
