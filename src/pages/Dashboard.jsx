import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { getPopularCities } from '../api/cities';
import { getCuratedCityPhoto } from '../api/photos';
import TripCard from '../components/TripCard';
import { getFlagEmoji } from '../components/flagUtils';
import {
  PlusCircle, Compass, Map, Briefcase, TrendingUp,
  ArrowRight, Sparkles, Calendar
} from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const { trips, getTripStatus } = useTrips();
  const navigate = useNavigate();
  const [popularCities, setPopularCities] = useState([]);

  useEffect(() => {
    const cities = getPopularCities().slice(0, 6);
    setPopularCities(cities);
  }, []);

  const recentTrips = [...trips].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 3);
  const ongoingCount = trips.filter(t => getTripStatus(t) === 'ongoing').length;
  const upcomingCount = trips.filter(t => getTripStatus(t) === 'upcoming').length;
  const completedCount = trips.filter(t => getTripStatus(t) === 'completed').length;
  const totalStops = trips.reduce((acc, t) => acc + (t.stops?.length || 0), 0);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const stats = [
    { label: 'Total Trips', value: trips.length, icon: Briefcase, color: '#3B82F6' },
    { label: 'Ongoing', value: ongoingCount, icon: TrendingUp, color: '#10B981' },
    { label: 'Upcoming', value: upcomingCount, icon: Calendar, color: '#F59E0B' },
    { label: 'Cities Visited', value: totalStops, icon: Map, color: '#8B5CF6' },
  ];

  return (
    <div className="page-container">
      {/* Hero Banner */}
      <div className="dashboard-hero glass-card-static">
        <div className="hero-content">
          <div className="hero-greeting">
            <Sparkles size={20} className="hero-sparkle" />
            <span>{getGreeting()}</span>
          </div>
          <h1>{user?.name || 'Traveler'}</h1>
          <p>Ready to plan your next adventure? Let's make it unforgettable.</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate('/create-trip')}
            id="hero-create-trip"
          >
            <PlusCircle size={18} /> Plan New Trip <ArrowRight size={18} />
          </button>
        </div>
          <div className="hero-visual animate-float">
          <div className="hero-globe">🌍</div>
        </div>
      </div>

      {/* Stats */}
      <div className="dashboard-stats grid grid-4 stagger">
        {stats.map((stat, i) => (
          <div className="stat-card glass-card" key={i}>
            <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
              <stat.icon size={20} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Trips */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Recent Trips</h2>
          {trips.length > 3 && (
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/trips')}>
              View All <ArrowRight size={14} />
            </button>
          )}
        </div>
        {recentTrips.length > 0 ? (
          <div className="grid grid-3 stagger">
            {recentTrips.map(trip => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="empty-state glass-card-static">
            <div className="empty-state-icon"><Briefcase size={32} /></div>
            <h3>No trips yet</h3>
            <p>Create your first trip and start exploring the world!</p>
            <button className="btn btn-primary" onClick={() => navigate('/create-trip')} id="empty-create-trip">
              <PlusCircle size={16} /> Create First Trip
            </button>
          </div>
        )}
      </section>

      {/* Recommended Cities */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>
            <Compass size={22} className="section-icon" /> Recommended Destinations
          </h2>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/search')}>
            Explore All <ArrowRight size={14} />
          </button>
        </div>
        <div className="recommended-cities stagger">
          {popularCities.map((city, i) => (
            <div
              className="rec-city-card glass-card"
              key={city.id}
              onClick={() => navigate('/search')}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <img src={getCuratedCityPhoto(city.name)} alt={city.name} loading="lazy" />
              <div className="rec-city-overlay">
                <h4>{city.name}</h4>
                <p>
                  {city.countryCode && (
                    <span className="rec-flag-emoji" aria-hidden="true">
                      {getFlagEmoji(city.countryCode)}
                    </span>
                  )}
                  {city.country}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
