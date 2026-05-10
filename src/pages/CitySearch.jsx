import { useState, useEffect, useCallback } from 'react';
import { searchCities, getPopularCities } from '../api/cities';
import CityCard from '../components/CityCard';
import { Search, Globe } from 'lucide-react';

export default function CitySearch() {
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { setCities(getPopularCities()); }, []);

  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

  const doSearch = useCallback(debounce(async (q) => {
    if (q.length < 2) { setCities(getPopularCities()); setLoading(false); return; }
    setLoading(true);
    const results = await searchCities(q, 12);
    setCities(results);
    setLoading(false);
  }, 300), []);

  useEffect(() => { doSearch(query); }, [query]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1><Globe size={28} style={{ display: 'inline', verticalAlign: 'middle' }} /> Explore Cities</h1>
        <p>Discover destinations around the world.</p>
      </div>
      <div className="city-search-wrapper" style={{ marginBottom: 'var(--space-xl)', maxWidth: 500 }}>
        <div className="input-with-icon">
          <Search size={16} className="input-icon" />
          <input type="text" className="form-input" placeholder="Search cities worldwide..." value={query}
            onChange={e => setQuery(e.target.value)} id="city-search-input" />
        </div>
      </div>
      {loading ? (
        <div className="loading-center"><div className="spinner" /></div>
      ) : (
        <div className="grid grid-3 stagger">
          {cities.map(city => <CityCard key={city.id} city={city} />)}
        </div>
      )}
    </div>
  );
}
