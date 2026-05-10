import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { BarChart3, Users, TrendingUp, MapPin, Activity, Lock } from 'lucide-react';

export default function AdminDashboard() {
  const { trips } = useTrips();

  // Simple admin check (in production, verify with backend)
  const isAdmin = localStorage.getItem('libruta_admin') === 'true';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-night flex items-center justify-center">
        <div className="backdrop-blur-lg bg-glass-dark border border-white/10 rounded-3xl p-12 text-center max-w-md shadow-2xl">
          <Lock size={48} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-300">Admin dashboard is restricted.</p>
        </div>
      </div>
    );
  }

  const uniqueUsers = new Set(trips.map(t => t.userId)).size;
  const totalActivities = trips.reduce((acc, t) =>
    acc + (t.stops || []).reduce((a, s) => a + (s.activities?.length || 0), 0), 0);
  const totalDestinations = trips.reduce((acc, t) => acc + (t.stops?.length || 0), 0);

  // Get top cities
  const cityCounts = {};
  trips.forEach(trip => {
    (trip.stops || []).forEach(stop => {
      const city = stop.cityName || 'Unknown';
      cityCounts[city] = (cityCounts[city] || 0) + 1;
    });
  });
  const topCities = Object.entries(cityCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const stats = [
    { label: 'Total Trips', value: trips.length, icon: TrendingUp, color: 'text-pastel-blue' },
    { label: 'Unique Users', value: uniqueUsers, icon: Users, color: 'text-pastel-lavender' },
    { label: 'Total Activities', value: totalActivities, icon: Activity, color: 'text-pastel-coral' },
    { label: 'Destinations', value: totalDestinations, icon: MapPin, color: 'text-pastel-mint' },
  ];

  return (
    <div className="min-h-screen bg-gradient-night py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <BarChart3 size={36} className="text-pastel-lavender" />
            Admin Dashboard
          </h1>
          <p className="text-gray-400">TravelLoop Platform Analytics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="backdrop-blur-lg bg-glass-dark border border-white/10 rounded-2xl p-6 shadow-2xl hover:border-white/20 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <Icon size={32} className={`${stat.color} opacity-60`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Top Cities */}
        <div className="backdrop-blur-lg bg-glass-dark border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <MapPin size={24} className="text-pastel-coral" />
            Top Destinations
          </h2>

          {topCities.length > 0 ? (
            <div className="space-y-3">
              {topCities.map(([city, count], i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <span className="text-white font-medium">{city}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-48 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pastel-lavender to-pastel-coral transition-all"
                        style={{ width: `${(count / Math.max(...topCities.map(([, c]) => c))) * 100}%` }}
                      />
                    </div>
                    <span className="text-pastel-lavender font-bold w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No data yet</p>
          )}
        </div>

        {/* Recent Trips */}
        <div className="mt-8 backdrop-blur-lg bg-glass-dark border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Trips</h2>
          <div className="space-y-3">
            {trips.slice(0, 5).map(trip => (
              <div
                key={trip.id}
                className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-semibold">{trip.name}</p>
                    <p className="text-gray-400 text-sm">{trip.stops?.length || 0} stops</p>
                  </div>
                  <span className="text-pastel-mint text-sm">
                    {new Date(trip.createdAt || trip.startDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
