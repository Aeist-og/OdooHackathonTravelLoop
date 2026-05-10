import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, LogOut, User, Menu } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path === '/trips') return 'My Trips';
    if (path === '/create-trip') return 'Create Trip';
    if (path.includes('/itinerary/')) return 'Itinerary';
    if (path === '/search') return 'Explore Cities';
    if (path === '/activities') return 'Activities';
    if (path === '/profile') return 'Profile';
    return 'LibreRuta';
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="btn-icon btn-ghost menu-toggle" onClick={onToggleSidebar} id="menu-toggle">
          <Menu size={20} />
        </button>
        <h4 className="navbar-title">{getPageTitle()}</h4>
      </div>

      <div className="navbar-right">
        <div className="navbar-search">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search trips, cities..."
            className="search-input"
            id="global-search"
          />
        </div>

        <button className="btn-icon btn-ghost notification-btn" id="notifications-btn">
          <Bell size={18} />
          <span className="notification-dot"></span>
        </button>

        <ThemeToggle />

        <div className="profile-dropdown-wrapper">
          <button
            className="profile-btn"
            onClick={() => setShowProfile(!showProfile)}
            id="profile-dropdown-btn"
          >
            <div className="profile-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className="profile-name">{user?.name?.split(' ')[0] || 'User'}</span>
          </button>

          {showProfile && (
            <div className="profile-dropdown animate-scale-in">
              <button onClick={() => { navigate('/profile'); setShowProfile(false); }} id="profile-link">
                <User size={16} /> Profile
              </button>
              <button onClick={() => { logout(); navigate('/login'); setShowProfile(false); }} id="logout-btn">
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
