import { useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { getCuratedCityPhoto } from '../api/photos';
import { Calendar, MapPin, Trash2, Edit3, Eye, Clock } from 'lucide-react';
import './TripCard.css';

export default function TripCard({ trip }) {
  const navigate = useNavigate();
  const { deleteTrip, getTripStatus } = useTrips();
  const status = getTripStatus(trip);

  const firstCity = trip.stops?.[0]?.cityName || trip.destination || '';
  const photo = getCuratedCityPhoto(firstCity);

  const statusConfig = {
    ongoing: { label: 'Ongoing', className: 'badge-success' },
    upcoming: { label: 'Upcoming', className: 'badge-primary' },
    completed: { label: 'Completed', className: 'badge-accent' },
    draft: { label: 'Draft', className: 'badge-danger' },
  };

  const sc = statusConfig[status] || statusConfig.draft;

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysCount = () => {
    if (!trip.startDate || !trip.endDate) return null;
    const diff = (new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24);
    return Math.max(1, Math.ceil(diff));
  };

  const days = getDaysCount();

  return (
    <div className="trip-card glass-card" id={`trip-card-${trip.id}`}>
      <div className="trip-card-image">
        <img src={photo} alt={trip.name} loading="lazy" />
        <div className="trip-card-overlay">
          <span className={`badge ${sc.className}`}>{sc.label}</span>
        </div>
      </div>

      <div className="trip-card-body">
        <h3 className="trip-card-title">{trip.name}</h3>

        {trip.description && (
          <p className="trip-card-desc">{trip.description}</p>
        )}

        <div className="trip-card-meta">
          {firstCity && (
            <div className="meta-item">
              <MapPin size={14} />
              <span>{firstCity}{trip.stops?.length > 1 ? ` +${trip.stops.length - 1}` : ''}</span>
            </div>
          )}
          <div className="meta-item">
            <Calendar size={14} />
            <span>{formatDate(trip.startDate)} — {formatDate(trip.endDate)}</span>
          </div>
          {days && (
            <div className="meta-item">
              <Clock size={14} />
              <span>{days} day{days > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        <div className="trip-card-actions">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate(`/itinerary/${trip.id}`)}
            id={`view-trip-${trip.id}`}
          >
            <Eye size={14} /> View
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(`/itinerary/${trip.id}/edit`)}
            id={`edit-trip-${trip.id}`}
          >
            <Edit3 size={14} /> Edit
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={(e) => { e.stopPropagation(); if (confirm('Delete this trip?')) deleteTrip(trip.id); }}
            id={`delete-trip-${trip.id}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
