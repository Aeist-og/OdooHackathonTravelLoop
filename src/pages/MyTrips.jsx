import { useState } from 'react';
import { useTrips } from '../context/TripContext';
import { useNavigate } from 'react-router-dom';
import TripCard from '../components/TripCard';
import { PlusCircle, Briefcase } from 'lucide-react';
import './MyTrips.css';

export default function MyTrips() {
  const { trips, getTripStatus } = useTrips();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'ongoing', label: 'Ongoing' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
    { id: 'draft', label: 'Drafts' },
  ];

  const filtered = activeTab === 'all'
    ? trips
    : trips.filter(t => getTripStatus(t) === activeTab);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="section-header">
          <h1>My Trips</h1>
          <button className="btn btn-primary" onClick={() => navigate('/create-trip')} id="new-trip-btn">
            <PlusCircle size={16} /> New Trip
          </button>
        </div>
        <p>Manage all your travel plans in one place.</p>
      </div>

      <div className="tabs" id="trip-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            id={`tab-${tab.id}`}
          >
            {tab.label}
            {tab.id !== 'all' && (
              <span className="tab-count">
                {trips.filter(t => tab.id === 'all' ? true : getTripStatus(t) === tab.id).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-3 stagger">
          {filtered.map(trip => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      ) : (
        <div className="empty-state glass-card-static">
          <div className="empty-state-icon"><Briefcase size={32} /></div>
          <h3>No trips found</h3>
          <p>{activeTab === 'all' ? "You haven't created any trips yet." : `No ${activeTab} trips.`}</p>
          <button className="btn btn-primary" onClick={() => navigate('/create-trip')}>
            <PlusCircle size={16} /> Create Trip
          </button>
        </div>
      )}
    </div>
  );
}
