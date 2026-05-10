import { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return { ...state, isLoading: false, user: action.payload, isAuthenticated: !!action.payload };
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    case 'UPDATE_PROFILE':
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const stored = localStorage.getItem('traveloop_user');
    if (stored) {
      try {
        dispatch({ type: 'INIT', payload: JSON.parse(stored) });
      } catch {
        dispatch({ type: 'INIT', payload: null });
      }
    } else {
      dispatch({ type: 'INIT', payload: null });
    }
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('traveloop_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { success: false, error: 'Invalid email or password' };
    const { password: _, ...safeUser } = user;
    localStorage.setItem('traveloop_user', JSON.stringify(safeUser));
    dispatch({ type: 'LOGIN', payload: safeUser });
    return { success: true };
  };

  const signup = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('traveloop_users') || '[]');
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }
    const newUser = {
      id: 'user_' + Date.now(),
      name,
      email,
      password,
      avatar: null,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem('traveloop_users', JSON.stringify(users));
    const { password: _, ...safeUser } = newUser;
    localStorage.setItem('traveloop_user', JSON.stringify(safeUser));
    dispatch({ type: 'LOGIN', payload: safeUser });
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('traveloop_user');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = (updates) => {
    const updated = { ...state.user, ...updates };
    localStorage.setItem('traveloop_user', JSON.stringify(updated));
    // Also update in users list
    const users = JSON.parse(localStorage.getItem('traveloop_users') || '[]');
    const idx = users.findIndex(u => u.id === updated.id);
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...updates };
      localStorage.setItem('traveloop_users', JSON.stringify(users));
    }
    dispatch({ type: 'UPDATE_PROFILE', payload: updates });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
