import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Map, PlusCircle, Compass,
  DollarSign, Package, StickyNote, Globe, Briefcase
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/trips', icon: Briefcase, label: 'My Trips' },
  { path: '/create-trip', icon: PlusCircle, label: 'Create Trip' },
  { path: '/search', icon: Compass, label: 'Explore Cities' },
  { path: '/activities', icon: Map, label: 'Activities' },
];

const secondaryItems = [
  { path: '/packing', icon: Package, label: 'Packing Lists' },
  { path: '/notes', icon: StickyNote, label: 'Trip Notes' },
];

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo" onClick={() => navigate('/')}>
            <div className="logo-icon">
              <Globe size={22} />
            </div>
            <span className="logo-text">
              Libre<span className="logo-accent">Ruta</span>
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-section-label">Main</span>
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
                onClick={onClose}
                end={item.path === '/'}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="nav-section">
            <span className="nav-section-label">Tools</span>
            {secondaryItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
                onClick={onClose}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-cta glass-card-static" onClick={() => navigate('/create-trip')}>
            <PlusCircle size={20} className="cta-icon" />
            <div>
              <p className="cta-title">New Adventure</p>
              <p className="cta-subtitle">Plan your next trip</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
