import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TripProvider } from './context/TripContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import MyTrips from './pages/MyTrips';
import ItineraryBuilder from './pages/ItineraryBuilder';
import ItineraryView from './pages/ItineraryView';
import SharedItinerary from './pages/SharedItinerary';
import CitySearch from './pages/CitySearch';
import ActivitySearch from './pages/ActivitySearch';
import TripBudget from './pages/TripBudget';
import PackingChecklist from './pages/PackingChecklist';
import TripNotes from './pages/TripNotes';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isAuth = ['/login', '/signup'].includes(location.pathname);
  const isPublic = location.pathname.startsWith('/shared') || location.pathname === '/admin';

  if (isPublic) {
    return (
      <Routes>
        <Route path="/shared/:tripId" element={<SharedItinerary />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    );
  }

  if (isAuth) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    );
  }

  return (
    <ProtectedRoute>
      <div className={`app-layout ${sidebarOpen ? 'sidebar-is-open' : ''}`}>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="main-content">
          <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/trips" element={<MyTrips />} />
            <Route path="/create-trip" element={<CreateTrip />} />
            <Route path="/itinerary/:tripId" element={<ItineraryView />} />
            <Route path="/itinerary/:tripId/edit" element={<ItineraryBuilder />} />
            <Route path="/search" element={<CitySearch />} />
            <Route path="/activities" element={<ActivitySearch />} />
            <Route path="/budget/:tripId" element={<TripBudget />} />
            <Route path="/packing" element={<PackingChecklist />} />
            <Route path="/notes" element={<TripNotes />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TripProvider>
          <AppLayout />
        </TripProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

