import { useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import Timeline from '../components/Timeline';
import { Share2, Copy, CheckCircle, MapPin, Calendar } from 'lucide-react';
import { useState } from 'react';

export default function SharedItinerary() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { getTrip } = useTrips();
  const trip = getTrip(tripId);
  const [copied, setCopied] = useState(false);

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-pastel-warm dark:bg-gradient-night flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Trip not found</h3>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/shared/${tripId}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-pastel-cool dark:bg-gradient-night py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="backdrop-blur-lg bg-glass-light dark:bg-glass-dark border border-white/30 dark:border-white/10 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
                {trip.name}
              </h1>
              <p className="text-gray-700 dark:text-gray-300">{trip.description}</p>
            </div>
            <Share2 size={32} className="text-pastel-coral opacity-60" />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Calendar size={18} className="text-pastel-lavender" />
              <span>
                {new Date(trip.startDate).toLocaleDateString()} —{' '}
                {new Date(trip.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <MapPin size={18} className="text-pastel-coral" />
              <span>{trip.stops?.length || 0} destinations</span>
            </div>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-4 py-2 rounded-lg backdrop-blur-md bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/10 text-gray-900 dark:text-white text-sm font-mono"
            />
            <button
              onClick={handleCopyUrl}
              className="px-6 py-2 rounded-lg backdrop-blur-md bg-pastel-lavender/30 dark:bg-pastel-lavender/20 border border-pastel-lavender/50 hover:bg-pastel-lavender/50 transition-all flex items-center gap-2 font-semibold text-gray-900 dark:text-white"
            >
              {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>

        <div className="backdrop-blur-lg bg-glass-light dark:bg-glass-dark border border-white/30 dark:border-white/10 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Itinerary</h2>
          <Timeline stops={trip.stops} />
        </div>
      </div>
    </div>
  );
}
