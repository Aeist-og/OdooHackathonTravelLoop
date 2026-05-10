import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { getWeather } from '../api/weather';
import Timeline from '../components/Timeline';
import {
  Edit3, Calendar, MapPin, DollarSign,
  Cloud, ArrowLeft, List
} from 'lucide-react';
import './ItineraryView.css';

export default function ItineraryView() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { getTrip, getTripStatus } = useTrips();
  const trip = getTrip(tripId);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (trip?.stops?.[0]?.latitude) {
      getWeather(trip.stops[0].latitude, trip.stops[0].longitude).then(setWeather);
    }
  }, [trip]);

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

  const status = getTripStatus(trip);
  const totalCost = (trip.stops || []).reduce((acc, s) =>
    acc + (s.activities || []).reduce((a, act) => a + (act.cost || 0), 0), 0);
  const totalActivities = (trip.stops || []).reduce((acc, s) => acc + (s.activities?.length || 0), 0);

  const statusConfig = {
    ongoing: { label: 'Ongoing', className: 'badge-success' },
    upcoming: { label: 'Upcoming', className: 'badge-primary' },
    completed: { label: 'Completed', className: 'badge-accent' },
    draft: { label: 'Draft', className: 'badge-danger' },
  };
  const sc = statusConfig[status] || statusConfig.draft;

  return (
    <div className="page-container">
      <button className="btn btn-ghost" onClick={() => navigate('/trips')} style={{ marginBottom: 'var(--space-md)' }}>
        <ArrowLeft size={16} /> Back to Trips
      </button>

      <div className="itinerary-header glass-card-static">
        <div className="itinerary-header-content">
          <div className="itinerary-header-top">
            <span className={`badge ${sc.className}`}>{sc.label}</span>
            {weather?.current && (
              <div className="weather-badge">
                <span>{weather.current.icon}</span>
                <span>{weather.current.temp}°C</span>
                <span className="weather-desc">{weather.current.description}</span>
              </div>
            )}
          </div>
          <h1>{trip.name}</h1>
          {trip.description && <p className="itinerary-desc">{trip.description}</p>}
          <div className="itinerary-meta">
            <div className="meta-item"><Calendar size={14} />
              {trip.startDate && new Date(trip.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              {trip.endDate && ` — ${new Date(trip.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
            </div>
            <div className="meta-item"><MapPin size={14} /> {trip.stops?.length || 0} stops</div>
            <div className="meta-item"><List size={14} /> {totalActivities} activities</div>
            <div className="meta-item"><DollarSign size={14} /> ${totalCost.toFixed(2)} estimated</div>
          </div>
        </div>
        <div className="itinerary-actions">
          <button className="btn btn-primary" onClick={() => navigate(`/itinerary/${tripId}/edit`)} id="edit-itinerary">
            <Edit3 size={16} /> Edit Itinerary
          </button>
          <button className="btn btn-secondary" onClick={() => navigate(`/budget/${tripId}`)} id="view-budget">
            <DollarSign size={16} /> Budget
          </button>
        </div>
      </div>

      {weather?.forecast && (
        <div className="weather-forecast glass-card-static">
          <h4><Cloud size={18} /> 7-Day Forecast — {trip.stops?.[0]?.cityName}</h4>
          <div className="forecast-grid">
            {weather.forecast.map((day, i) => (
              <div key={i} className="forecast-day">
                <span className="forecast-date">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className="forecast-icon">{day.icon}</span>
                <span className="forecast-temps">
                  <strong>{Math.round(day.tempMax)}°</strong> / {Math.round(day.tempMin)}°
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="itinerary-timeline">
        <h2 style={{ marginBottom: 'var(--space-lg)' }}>📍 Itinerary</h2>
        <Timeline stops={trip.stops} />
      </div>
    </div>
  );
}
