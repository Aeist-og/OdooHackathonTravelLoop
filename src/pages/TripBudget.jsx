import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import BudgetChart from '../components/BudgetChart';
import { DollarSign, Plus, Trash2, ArrowLeft, PieChart, BarChart3 } from 'lucide-react';

const CATEGORIES = ['transport', 'accommodation', 'food', 'activities', 'shopping', 'other'];

export default function TripBudget() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { getTrip, updateBudget } = useTrips();
  const trip = getTrip(tripId);
  const [chartType, setChartType] = useState('pie');
  const [newItem, setNewItem] = useState({ name: '', amount: '', category: 'food' });

  if (!trip) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h3>Trip not found</h3>
          <button className="btn btn-primary" onClick={() => navigate('/trips')}>Back to Trips</button>
        </div>
      </div>
    );
  }

  const budget = trip.budget || { currency: 'USD', items: [] };

  const handleAddItem = () => {
    if (!newItem.name.trim() || !newItem.amount) return;
    const items = [...(budget.items || []), { ...newItem, id: 'bi_' + Date.now(), amount: parseFloat(newItem.amount) }];
    updateBudget(tripId, { ...budget, items });
    setNewItem({ name: '', amount: '', category: 'food' });
  };

  const handleDeleteItem = (itemId) => {
    const items = (budget.items || []).filter(i => i.id !== itemId);
    updateBudget(tripId, { ...budget, items });
  };

  const total = (budget.items || []).reduce((a, i) => a + (i.amount || 0), 0);
  const activityCosts = (trip.stops || []).reduce((acc, s) =>
    acc + (s.activities || []).reduce((a, act) => a + (act.cost || 0), 0), 0);

  return (
    <div className="page-container">
      <button className="btn btn-ghost" onClick={() => navigate(`/itinerary/${tripId}`)} style={{ marginBottom: 'var(--space-md)' }}>
        <ArrowLeft size={16} /> Back to Trip
      </button>

      <div className="page-header">
        <h1>💰 Trip Budget</h1>
        <p>{trip.name} — Track your expenses and plan your spending.</p>
      </div>

      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        {/* Chart */}
        <div className="glass-card-static">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
            <h3>Breakdown</h3>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button className={`btn btn-icon btn-sm ${chartType === 'pie' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setChartType('pie')}><PieChart size={16} /></button>
              <button className={`btn btn-icon btn-sm ${chartType === 'bar' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setChartType('bar')}><BarChart3 size={16} /></button>
            </div>
          </div>
          <BudgetChart budget={budget} type={chartType} />
          {activityCosts > 0 && (
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 'var(--space-md)', textAlign: 'center' }}>
              + ${activityCosts.toFixed(2)} from itinerary activities
            </p>
          )}
        </div>

        {/* Items */}
        <div className="glass-card-static">
          <h3 style={{ marginBottom: 'var(--space-md)' }}>Expenses</h3>
          <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--space-md)', flexWrap: 'wrap' }}>
            <input type="text" className="form-input" placeholder="Expense name" value={newItem.name}
              onChange={e => setNewItem({ ...newItem, name: e.target.value })} style={{ flex: '2 1 150px' }} />
            <input type="number" className="form-input" placeholder="$0.00" value={newItem.amount}
              onChange={e => setNewItem({ ...newItem, amount: e.target.value })} style={{ flex: '1 1 80px' }} />
            <select className="form-input" value={newItem.category}
              onChange={e => setNewItem({ ...newItem, category: e.target.value })} style={{ flex: '1 1 120px' }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
            <button className="btn btn-primary btn-sm" onClick={handleAddItem}><Plus size={14} /> Add</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: 400, overflowY: 'auto' }}>
            {(budget.items || []).map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
                background: 'var(--glass)', borderRadius: 'var(--radius-sm)' }}>
                <span className={`badge badge-primary`} style={{ fontSize: '0.7rem' }}>{item.category}</span>
                <span style={{ flex: 1, fontSize: '0.88rem' }}>{item.name}</span>
                <span style={{ fontWeight: 700, color: 'var(--accent)' }}>${item.amount?.toFixed(2)}</span>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleDeleteItem(item.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)',
            borderTop: '1px solid var(--glass-border)' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Grand Total</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-light)' }}>
              ${(total + activityCosts).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
