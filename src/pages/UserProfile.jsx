import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { User, Mail, Calendar, Map, Save } from 'lucide-react';

export default function UserProfile() {
  const { user, updateProfile } = useAuth();
  const { trips } = useTrips();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateProfile({ name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const totalCities = trips.reduce((acc, t) => acc + (t.stops?.length || 0), 0);
  const totalActivities = trips.reduce((acc, t) =>
    acc + (t.stops || []).reduce((a, s) => a + (s.activities?.length || 0), 0), 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>👤 Profile</h1>
        <p>Manage your account settings.</p>
      </div>

      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        {/* Profile Card */}
        <div className="glass-card-static" style={{ textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800,
            color: 'white', margin: '0 auto var(--space-lg)', boxShadow: 'var(--shadow-glow)' }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <h2>{user?.name}</h2>
          <p style={{ marginBottom: 'var(--space-lg)' }}>{user?.email}</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-md)', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-light)' }}>{trips.length}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Trips</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>{totalCities}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Cities</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>{totalActivities}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Activities</div>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-lg)', fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <Calendar size={12} /> Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
          </div>
        </div>

        {/* Edit Form */}
        <div className="glass-card-static">
          <h3 style={{ marginBottom: 'var(--space-lg)' }}>Edit Profile</h3>
          <div className="form-group">
            <label className="form-label"><User size={14} /> Full Name</label>
            <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} id="profile-name" />
          </div>
          <div className="form-group">
            <label className="form-label"><Mail size={14} /> Email</label>
            <input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} id="profile-email" />
          </div>
          <button className="btn btn-primary" onClick={handleSave} id="save-profile" style={{ width: '100%' }}>
            {saved ? '✓ Saved!' : <><Save size={16} /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}
