import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { searchCities } from '../api/cities';
import { searchActivities, getActivityTypes } from '../api/activities';
import { getActivityEmoji } from '../components/ActivityHelpers';
import {
  Plus, Search, X, MapPin, Trash2, GripVertical,
  Calendar, ChevronDown, ChevronUp, Save, ArrowLeft, DollarSign
} from 'lucide-react';
import './ItineraryBuilder.css';

export default function ItineraryBuilder() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { getTrip, addStop, deleteStop, reorderStops, addActivity, deleteActivity, updateTrip } = useTrips();
  const trip = getTrip(tripId);

  const [cityQuery, setCityQuery] = useState('');
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [expandedStop, setExpandedStop] = useState(null);
  const [activityQuery, setActivityQuery] = useState('');
  const [activityType, setActivityType] = useState('attraction');
  const [activityResults, setActivityResults] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(null);
  const [customActivity, setCustomActivity] = useState({ name: '', type: 'sightseeing', cost: '', duration: '', notes: '', startTime: '', location: '' });
  const [dragIndex, setDragIndex] = useState(null);

  const debounce = (fn, ms) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  };

  const fetchCities = useCallback(
    debounce(async (q) => {
      if (q.length < 2) { setCitySuggestions([]); return; }
      const results = await searchCities(q, 6);
      setCitySuggestions(results);
      setShowCitySuggestions(true);
    }, 300),
    []
  );

  useEffect(() => { fetchCities(cityQuery); }, [cityQuery]);

  if (!trip) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h3>Trip not found</h3>
          <button className="btn btn-primary" onClick={() => navigate('/trips')}>Back to Trips</button>
        </div>
      </div>
    );
  }

  const handleAddStop = (city) => {
    addStop(tripId, {
      cityName: city.name,
      country: city.country,
      countryCode: city.countryCode,
      latitude: city.latitude,
      longitude: city.longitude,
    });
    setCityQuery('');
    setCitySuggestions([]);
    setShowCitySuggestions(false);
  };

  const handleSearchActivities = async (stopId, lat, lon) => {
    setLoadingActivities(true);
    const results = await searchActivities(lat, lon, activityType, 5000, 15);
    setActivityResults(results);
    setLoadingActivities(false);
  };

  const handleAddActivityFromSearch = (stopId, activity) => {
    addActivity(tripId, stopId, {
      name: activity.name,
      type: activity.type || activity.category,
      category: activity.category,
      cost: 0,
      duration: '',
      notes: '',
      address: activity.address,
      website: activity.website,
      lat: activity.lat,
      lon: activity.lon,
    });
  };

  const handleAddCustomActivity = (stopId) => {
    if (!customActivity.name.trim()) return;
    addActivity(tripId, stopId, {
      ...customActivity,
      cost: parseFloat(customActivity.cost) || 0,
    });
    setCustomActivity({ name: '', type: 'sightseeing', cost: '', duration: '', notes: '', startTime: '', location: '' });
  };

  const handleDragStart = (idx) => setDragIndex(idx);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (idx) => {
    if (dragIndex === null || dragIndex === idx) return;
    const stops = [...(trip.stops || [])];
    const [moved] = stops.splice(dragIndex, 1);
    stops.splice(idx, 0, moved);
    reorderStops(tripId, stops);
    setDragIndex(null);
  };

  return (
    <div className="page-container">
      <div className="builder-header">
        <button className="btn btn-ghost" onClick={() => navigate(`/itinerary/${tripId}`)}>
          <ArrowLeft size={16} /> Back to View
        </button>
        <div>
          <h1>🗺️ {trip.name}</h1>
          <p>Add cities and activities to build your itinerary</p>
        </div>
      </div>

      {/* Add City */}
      <div className="builder-add-city glass-card-static">
        <h4><MapPin size={18} /> Add a Stop</h4>
        <div className="city-search-wrapper">
          <div className="input-with-icon">
            <Search size={16} className="input-icon" />
            <input
              type="text"
              className="form-input"
              placeholder="Search for a city to add..."
              value={cityQuery}
              onChange={e => setCityQuery(e.target.value)}
              onFocus={() => citySuggestions.length > 0 && setShowCitySuggestions(true)}
              onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)}
              id="builder-city-search"
            />
          </div>
          {showCitySuggestions && citySuggestions.length > 0 && (
            <div className="city-suggestions animate-scale-in">
              {citySuggestions.map(city => (
                <button key={city.id} type="button" className="city-suggestion-item" onClick={() => handleAddStop(city)}>
                  {city.countryCode && (
                    <img src={`https://flagcdn.com/20x15/${city.countryCode.toLowerCase()}.png`} alt="" className="suggestion-flag" />
                  )}
                  <div className="suggestion-info">
                    <span className="suggestion-name">{city.name}</span>
                    <span className="suggestion-country">{city.country}</span>
                  </div>
                  <Plus size={16} className="suggestion-add" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stops List */}
      <div className="builder-stops stagger">
        {(trip.stops || []).map((stop, index) => (
          <div
            key={stop.id}
            className={`builder-stop glass-card-static ${expandedStop === stop.id ? 'expanded' : ''}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
          >
            <div className="stop-header" onClick={() => setExpandedStop(expandedStop === stop.id ? null : stop.id)}>
              <div className="stop-drag"><GripVertical size={16} /></div>
              <div className="stop-number">{index + 1}</div>
              <div className="stop-info">
                <h4>{stop.cityName}</h4>
                <span className="stop-country">{stop.country}</span>
              </div>
              <div className="stop-meta">
                <span className="badge badge-primary">{stop.activities?.length || 0} activities</span>
                {expandedStop === stop.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={(e) => { e.stopPropagation(); deleteStop(tripId, stop.id); }}>
                <Trash2 size={14} />
              </button>
            </div>

            {expandedStop === stop.id && (
              <div className="stop-expanded animate-fade-in">
                {/* Dates */}
                <div className="stop-dates form-row">
                  <div className="form-group">
                    <label className="form-label"><Calendar size={12} /> Arrival</label>
                    <input type="date" className="form-input" defaultValue={stop.startDate} 
                      onChange={e => {/* updateStop would go here */}} />
                  </div>
                  <div className="form-group">
                    <label className="form-label"><Calendar size={12} /> Departure</label>
                    <input type="date" className="form-input" defaultValue={stop.endDate}
                      onChange={e => {/* updateStop would go here */}} />
                  </div>
                </div>

                {/* Existing Activities */}
                {stop.activities?.length > 0 && (
                  <div className="stop-activities">
                    <h5>Activities Timeline</h5>
                    <div className="timeline-container">
                      {stop.activities.map(act => (
                        <div key={act.id} className="timeline-item">
                          <div className="timeline-dot" />
                          <div className="timeline-header">
                            <div className="timeline-title-group">
                              <span className="activity-emoji">{getActivityEmoji(act.type)}</span>
                              <span>{act.name}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              {act.startTime && <span className="timeline-time">{act.startTime}</span>}
                              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => deleteActivity(tripId, stop.id, act.id)}>
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                          
                          {(act.location || act.address || act.cost > 0) && (
                            <div className="timeline-details">
                              {(act.location || act.address) && (
                                <span className="timeline-detail-item"><MapPin size={12} /> {act.location || act.address}</span>
                              )}
                              {act.cost > 0 && (
                                <span className="timeline-detail-item"><DollarSign size={12} /> <span className="activity-cost">${act.cost}</span></span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Activity */}
                <div className="add-activity-section">
                  <div className="add-activity-tabs">
                    <button
                      className={`tab ${showAddActivity === 'search' ? 'active' : ''}`}
                      onClick={() => { setShowAddActivity(showAddActivity === 'search' ? null : 'search'); if (stop.latitude) handleSearchActivities(stop.id, stop.latitude, stop.longitude); }}
                    >
                      <Search size={14} /> Search Nearby
                    </button>
                    <button
                      className={`tab ${showAddActivity === 'custom' ? 'active' : ''}`}
                      onClick={() => setShowAddActivity(showAddActivity === 'custom' ? null : 'custom')}
                    >
                      <Plus size={14} /> Custom
                    </button>
                  </div>

                  {showAddActivity === 'search' && (
                    <div className="activity-search-panel animate-fade-in">
                      <div className="activity-type-filter">
                        {getActivityTypes().slice(0, 8).map(at => (
                          <button
                            key={at.value}
                            className={`filter-chip ${activityType === at.value ? 'active' : ''}`}
                            onClick={() => { setActivityType(at.value); handleSearchActivities(stop.id, stop.latitude, stop.longitude); }}
                          >
                            {at.emoji} {at.label}
                          </button>
                        ))}
                      </div>
                      {loadingActivities ? (
                        <div className="loading-center"><div className="spinner" /></div>
                      ) : (
                        <div className="activity-results">
                          {activityResults.map(act => (
                            <button key={act.id} className="activity-result-item" onClick={() => handleAddActivityFromSearch(stop.id, act)}>
                              <span>{getActivityEmoji(act.type)}</span>
                              <span className="activity-result-name">{act.name}</span>
                              <Plus size={14} />
                            </button>
                          ))}
                          {activityResults.length === 0 && <p className="no-results">No activities found nearby. Try a different category.</p>}
                        </div>
                      )}
                    </div>
                  )}

                  {showAddActivity === 'custom' && (
                    <div className="custom-activity-form animate-fade-in">
                      <div className="form-row">
                        <div className="form-group">
                          <input type="text" className="form-input" placeholder="Activity name" value={customActivity.name}
                            onChange={e => setCustomActivity({ ...customActivity, name: e.target.value })} />
                        </div>
                        <div className="form-group">
                          <select className="form-input" value={customActivity.type}
                            onChange={e => setCustomActivity({ ...customActivity, type: e.target.value })}>
                            {getActivityTypes().map(at => (
                              <option key={at.value} value={at.value}>{at.emoji} {at.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <input type="text" className="form-input" placeholder="Location/Address" value={customActivity.location}
                            onChange={e => setCustomActivity({ ...customActivity, location: e.target.value })} />
                        </div>
                        <div className="form-group">
                          <input type="time" className="form-input" value={customActivity.startTime}
                            onChange={e => setCustomActivity({ ...customActivity, startTime: e.target.value })} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <input type="number" className="form-input" placeholder="Cost ($)" value={customActivity.cost}
                            onChange={e => setCustomActivity({ ...customActivity, cost: e.target.value })} />
                        </div>
                        <div className="form-group">
                          <input type="text" className="form-input" placeholder="Duration (e.g. 2h)" value={customActivity.duration}
                            onChange={e => setCustomActivity({ ...customActivity, duration: e.target.value })} />
                        </div>
                      </div>
                      <button className="btn btn-primary btn-sm" onClick={() => handleAddCustomActivity(stop.id)}>
                        <Plus size={14} /> Add Activity
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {(!trip.stops || trip.stops.length === 0) && (
          <div className="empty-state glass-card-static">
            <div className="empty-state-icon"><MapPin size={32} /></div>
            <h3>No stops added</h3>
            <p>Search for a city above to add your first stop.</p>
          </div>
        )}
      </div>
    </div>
  );
}
