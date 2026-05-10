import { getActivityEmoji } from './ActivityHelpers';
import { Clock, DollarSign, MapPin, ExternalLink, Trash2 } from 'lucide-react';
import './ActivityCard.css';

export default function ActivityCard({ activity, onDelete, onEdit, showActions = true }) {
  const emoji = getActivityEmoji(activity.type || activity.category);

  return (
    <div className="activity-card glass-card" id={`activity-${activity.id}`}>
      <div className="activity-card-icon">
        <span>{emoji}</span>
      </div>

      <div className="activity-card-content">
        <h5 className="activity-name">{activity.name}</h5>

        <div className="activity-meta">
          {activity.category && (
            <span className="badge badge-primary">{activity.category}</span>
          )}
          {activity.duration && (
            <div className="activity-meta-item">
              <Clock size={12} />
              <span>{activity.duration}</span>
            </div>
          )}
          {activity.cost > 0 && (
            <div className="activity-meta-item">
              <DollarSign size={12} />
              <span>${activity.cost}</span>
            </div>
          )}
          {activity.address && (
            <div className="activity-meta-item">
              <MapPin size={12} />
              <span>{activity.address}</span>
            </div>
          )}
        </div>

        {activity.notes && (
          <p className="activity-notes">{activity.notes}</p>
        )}
      </div>

      {showActions && (
        <div className="activity-actions">
          {activity.website && (
            <a href={activity.website} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-icon btn-sm">
              <ExternalLink size={14} />
            </a>
          )}
          {onDelete && (
            <button className="btn btn-ghost btn-icon btn-sm" onClick={() => onDelete(activity.id)}>
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
