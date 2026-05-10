import { useState } from 'react';
import { useTrips } from '../context/TripContext';
import { Package, Plus, Check, Trash2, RotateCcw } from 'lucide-react';

const DEFAULT_CATEGORIES = {
  'Essentials': ['Passport', 'Wallet', 'Phone charger', 'Travel adapter'],
  'Clothing': ['T-shirts', 'Pants', 'Underwear', 'Socks', 'Jacket'],
  'Toiletries': ['Toothbrush', 'Sunscreen', 'Deodorant', 'Shampoo'],
  'Tech': ['Laptop', 'Camera', 'Headphones', 'Power bank'],
};

export default function PackingChecklist() {
  const { trips, updatePacking } = useTrips();
  const [selectedTrip, setSelectedTrip] = useState(trips[0]?.id || '');
  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState('Essentials');

  const trip = trips.find(t => t.id === selectedTrip);
  const packingList = trip?.packingList || [];

  const handleAdd = () => {
    if (!newItem.trim() || !selectedTrip) return;
    const updated = [...packingList, { id: 'pk_' + Date.now(), name: newItem.trim(), category: newCategory, checked: false }];
    updatePacking(selectedTrip, updated);
    setNewItem('');
  };

  const handleToggle = (itemId) => {
    const updated = packingList.map(i => i.id === itemId ? { ...i, checked: !i.checked } : i);
    updatePacking(selectedTrip, updated);
  };

  const handleDelete = (itemId) => {
    updatePacking(selectedTrip, packingList.filter(i => i.id !== itemId));
  };

  const handleReset = () => {
    updatePacking(selectedTrip, packingList.map(i => ({ ...i, checked: false })));
  };

  const handleAddDefaults = () => {
    const existing = packingList.map(i => i.name.toLowerCase());
    const newItems = [];
    Object.entries(DEFAULT_CATEGORIES).forEach(([cat, items]) => {
      items.forEach(name => {
        if (!existing.includes(name.toLowerCase())) {
          newItems.push({ id: 'pk_' + Date.now() + Math.random(), name, category: cat, checked: false });
        }
      });
    });
    updatePacking(selectedTrip, [...packingList, ...newItems]);
  };

  const categories = [...new Set(packingList.map(i => i.category))];
  const checkedCount = packingList.filter(i => i.checked).length;
  const progress = packingList.length > 0 ? Math.round((checkedCount / packingList.length) * 100) : 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📦 Packing Checklist</h1>
        <p>Never forget anything on your trip.</p>
      </div>

      {trips.length === 0 ? (
        <div className="empty-state glass-card-static">
          <div className="empty-state-icon"><Package size={32} /></div>
          <h3>Create a trip first</h3>
          <p>You need at least one trip to create a packing list.</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)', flexWrap: 'wrap', alignItems: 'center' }}>
            <select className="form-input" value={selectedTrip} onChange={e => setSelectedTrip(e.target.value)}
              style={{ maxWidth: 300 }}>
              {trips.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <button className="btn btn-secondary btn-sm" onClick={handleAddDefaults}>
              <Plus size={14} /> Add Defaults
            </button>
            <button className="btn btn-ghost btn-sm" onClick={handleReset}>
              <RotateCcw size={14} /> Reset All
            </button>
          </div>

          {/* Progress */}
          <div className="glass-card-static" style={{ marginBottom: 'var(--space-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Packed {checkedCount} of {packingList.length}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-light)' }}>{progress}%</span>
            </div>
            <div style={{ height: 8, background: 'var(--surface)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'var(--gradient-primary)', borderRadius: 'var(--radius-full)',
                transition: 'width var(--transition-base)' }} />
            </div>
          </div>

          {/* Add Item */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--space-xl)' }}>
            <input type="text" className="form-input" placeholder="Add item..." value={newItem}
              onChange={e => setNewItem(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()}
              style={{ flex: 1 }} />
            <select className="form-input" value={newCategory} onChange={e => setNewCategory(e.target.value)}
              style={{ maxWidth: 160 }}>
              {Object.keys(DEFAULT_CATEGORIES).map(c => <option key={c}>{c}</option>)}
              <option>Other</option>
            </select>
            <button className="btn btn-primary btn-sm" onClick={handleAdd}><Plus size={14} /></button>
          </div>

          {/* Items by category */}
          {categories.map(cat => (
            <div key={cat} className="glass-card-static" style={{ marginBottom: 'var(--space-md)' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: 'var(--space-sm)', color: 'var(--text-secondary)' }}>{cat}</h4>
              {packingList.filter(i => i.category === cat).map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0',
                  borderBottom: '1px solid var(--glass-border-light)' }}>
                  <button onClick={() => handleToggle(item.id)}
                    style={{ width: 24, height: 24, borderRadius: 6, border: `2px solid ${item.checked ? 'var(--success)' : 'var(--text-muted)'}`,
                      background: item.checked ? 'var(--success)' : 'var(--surface-light)', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'all var(--transition-fast)' }}>
                    {item.checked && <Check size={16} color="white" strokeWidth={3} />}
                  </button>
                  <span style={{ flex: 1, fontSize: '0.9rem', textDecoration: item.checked ? 'line-through' : 'none',
                    color: item.checked ? 'var(--text-muted)' : 'var(--text-primary)', transition: 'all var(--transition-fast)' }}>
                    {item.name}
                  </span>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleDelete(item.id)}
                    style={{ color: 'var(--text-muted)' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
