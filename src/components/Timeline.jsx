import { getActivityEmoji } from './ActivityHelpers';
import { MapPin, Clock } from 'lucide-react';
import './Timeline.css';

export default function Timeline({ stops }) {
  if (!stops?.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><MapPin size={32} /></div>
        <h3>No stops yet</h3>
        <p>Add your first destination to start building your itinerary.</p>
      </div>
    );
  }

  return (
    <div className="timeline">
      {stops.map((stop, index) => (
        <div className="timeline-item" key={stop.id} style={{ animationDelay: `${index * 0.1}s` }}>
          <div className="timeline-connector">
            <div className="timeline-dot">
              <span className="timeline-number">{index + 1}</span>
            </div>
            {index < stops.length - 1 && <div className="timeline-line" />}
          </div>

          <div className="timeline-content glass-card-static">
            <div className="timeline-header">
              <div>
                <h4>{stop.cityName || stop.name}</h4>
                {stop.country && <p className="timeline-country">{stop.country}</p>}
              </div>
              {(stop.startDate || stop.endDate) && (
                <div className="timeline-dates">
                  <Clock size={14} />
                  <span>
                    {stop.startDate && new Date(stop.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {stop.endDate && ` — ${new Date(stop.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                  </span>
                </div>
              )}
            </div>

            {stop.activities?.length > 0 && (
              <div className="timeline-activities">
                {stop.activities.map(activity => (
                  <div className="timeline-activity" key={activity.id}>
                    <span className="timeline-activity-emoji">
                      {getActivityEmoji(activity.type || activity.category)}
                    </span>
                    <span className="timeline-activity-name">{activity.name}</span>
                    {activity.cost > 0 && (
                      <span className="timeline-activity-cost">${activity.cost}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
