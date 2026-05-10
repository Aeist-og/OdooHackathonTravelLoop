import { createContext, useContext, useReducer, useEffect } from 'react';

const TripContext = createContext(null);

const initialState = {
  trips: [],
  isLoading: true,
};

function tripReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return { ...state, trips: action.payload, isLoading: false };
    case 'ADD_TRIP':
      return { ...state, trips: [...state.trips, action.payload] };
    case 'UPDATE_TRIP':
      return {
        ...state,
        trips: state.trips.map(t => t.id === action.payload.id ? { ...t, ...action.payload } : t),
      };
    case 'DELETE_TRIP':
      return { ...state, trips: state.trips.filter(t => t.id !== action.payload) };
    case 'ADD_STOP':
      return {
        ...state,
        trips: state.trips.map(t => t.id === action.payload.tripId
          ? { ...t, stops: [...(t.stops || []), action.payload.stop] }
          : t
        ),
      };
    case 'UPDATE_STOP':
      return {
        ...state,
        trips: state.trips.map(t => t.id === action.payload.tripId
          ? {
              ...t,
              stops: (t.stops || []).map(s => s.id === action.payload.stop.id ? { ...s, ...action.payload.stop } : s),
            }
          : t
        ),
      };
    case 'DELETE_STOP':
      return {
        ...state,
        trips: state.trips.map(t => t.id === action.payload.tripId
          ? { ...t, stops: (t.stops || []).filter(s => s.id !== action.payload.stopId) }
          : t
        ),
      };
    case 'REORDER_STOPS':
      return {
        ...state,
        trips: state.trips.map(t => t.id === action.payload.tripId
          ? { ...t, stops: action.payload.stops }
          : t
        ),
      };
    case 'ADD_ACTIVITY':
      return {
        ...state,
        trips: state.trips.map(t => t.id === action.payload.tripId
          ? {
              ...t,
              stops: (t.stops || []).map(s => s.id === action.payload.stopId
                ? { ...s, activities: [...(s.activities || []), action.payload.activity] }
                : s
              ),
            }
          : t
        ),
      };
    case 'UPDATE_ACTIVITY':
      return {
        ...state,
        trips: state.trips.map(t => t.id === action.payload.tripId
          ? {
              ...t,
              stops: (t.stops || []).map(s => s.id === action.payload.stopId
                ? {
                    ...s,
                    activities: (s.activities || []).map(a =>
                      a.id === action.payload.activity.id ? { ...a, ...action.payload.activity } : a
                    ),
                  }
                : s
              ),
            }
          : t
        ),
      };
    case 'DELETE_ACTIVITY':
      return {
        ...state,
        trips: state.trips.map(t => t.id === action.payload.tripId
          ? {
              ...t,
              stops: (t.stops || []).map(s => s.id === action.payload.stopId
                ? { ...s, activities: (s.activities || []).filter(a => a.id !== action.payload.activityId) }
                : s
              ),
            }
          : t
        ),
      };
    case 'UPDATE_BUDGET':
      return {
        ...state,
        trips: state.trips.map(t => t.id === action.payload.tripId
          ? { ...t, budget: { ...(t.budget || {}), ...action.payload.budget } }
          : t
        ),
      };
    case 'ADD_NOTE':
      return {
        ...state,
        trips: state.trips.map(t => t.id === action.payload.tripId
          ? { ...t, notes: [...(t.notes || []), action.payload.note] }
          : t
        ),
      };
    case 'DELETE_NOTE':
      return {
        ...state,
        trips: state.trips.map(t => t.id === action.payload.tripId
          ? { ...t, notes: (t.notes || []).filter(n => n.id !== action.payload.noteId) }
          : t
        ),
      };
    case 'UPDATE_PACKING':
      return {
        ...state,
        trips: state.trips.map(t => t.id === action.payload.tripId
          ? { ...t, packingList: action.payload.packingList }
          : t
        ),
      };
    default:
      return state;
  }
}

export function TripProvider({ children }) {
  const [state, dispatch] = useReducer(tripReducer, initialState);

  // Load trips from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('traveloop_trips');
    if (stored) {
      try {
        dispatch({ type: 'INIT', payload: JSON.parse(stored) });
      } catch {
        dispatch({ type: 'INIT', payload: [] });
      }
    } else {
      dispatch({ type: 'INIT', payload: [] });
    }
  }, []);

  // Persist trips to localStorage
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem('traveloop_trips', JSON.stringify(state.trips));
    }
  }, [state.trips, state.isLoading]);

  const addTrip = (trip) => {
    const newTrip = {
      ...trip,
      id: 'trip_' + Date.now(),
      stops: [],
      notes: [],
      packingList: [],
      budget: { currency: 'USD', items: [] },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_TRIP', payload: newTrip });
    return newTrip;
  };

  const updateTrip = (tripUpdate) => {
    dispatch({ type: 'UPDATE_TRIP', payload: { ...tripUpdate, updatedAt: new Date().toISOString() } });
  };

  const deleteTrip = (tripId) => {
    dispatch({ type: 'DELETE_TRIP', payload: tripId });
  };

  const getTrip = (tripId) => state.trips.find(t => t.id === tripId);

  const addStop = (tripId, stop) => {
    const newStop = {
      ...stop,
      id: 'stop_' + Date.now(),
      activities: [],
      order: (getTrip(tripId)?.stops?.length || 0),
    };
    dispatch({ type: 'ADD_STOP', payload: { tripId, stop: newStop } });
    return newStop;
  };

  const updateStop = (tripId, stop) => {
    dispatch({ type: 'UPDATE_STOP', payload: { tripId, stop } });
  };

  const deleteStop = (tripId, stopId) => {
    dispatch({ type: 'DELETE_STOP', payload: { tripId, stopId } });
  };

  const reorderStops = (tripId, stops) => {
    dispatch({ type: 'REORDER_STOPS', payload: { tripId, stops } });
  };

  const addActivity = (tripId, stopId, activity) => {
    const newActivity = {
      ...activity,
      id: 'act_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_ACTIVITY', payload: { tripId, stopId, activity: newActivity } });
    return newActivity;
  };

  const updateActivity = (tripId, stopId, activity) => {
    dispatch({ type: 'UPDATE_ACTIVITY', payload: { tripId, stopId, activity } });
  };

  const deleteActivity = (tripId, stopId, activityId) => {
    dispatch({ type: 'DELETE_ACTIVITY', payload: { tripId, stopId, activityId } });
  };

  const updateBudget = (tripId, budget) => {
    dispatch({ type: 'UPDATE_BUDGET', payload: { tripId, budget } });
  };

  const addNote = (tripId, note) => {
    const newNote = {
      ...note,
      id: 'note_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_NOTE', payload: { tripId, note: newNote } });
  };

  const deleteNote = (tripId, noteId) => {
    dispatch({ type: 'DELETE_NOTE', payload: { tripId, noteId } });
  };

  const updatePacking = (tripId, packingList) => {
    dispatch({ type: 'UPDATE_PACKING', payload: { tripId, packingList } });
  };

  const getTripStatus = (trip) => {
    if (!trip?.startDate || !trip?.endDate) return 'draft';
    const now = new Date();
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'ongoing';
  };

  const getTripsByStatus = (status) => {
    return state.trips.filter(t => getTripStatus(t) === status);
  };

  return (
    <TripContext.Provider value={{
      ...state,
      addTrip, updateTrip, deleteTrip, getTrip,
      addStop, updateStop, deleteStop, reorderStops,
      addActivity, updateActivity, deleteActivity,
      updateBudget, addNote, deleteNote, updatePacking,
      getTripStatus, getTripsByStatus,
    }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrips() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTrips must be used within TripProvider');
  return ctx;
}
