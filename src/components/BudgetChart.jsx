import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement,
} from 'chart.js';
import './BudgetChart.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const CATEGORY_COLORS = {
  transport: '#3B82F6',
  accommodation: '#8B5CF6',
  food: '#F59E0B',
  activities: '#10B981',
  shopping: '#EC4899',
  other: '#64748B',
};

export default function BudgetChart({ budget, type = 'pie' }) {
  if (!budget?.items?.length) {
    return (
      <div className="budget-chart-empty">
        <p>No budget items yet</p>
      </div>
    );
  }

  const categoryTotals = {};
  budget.items.forEach(item => {
    const cat = item.category || 'other';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + (item.amount || 0);
  });

  const labels = Object.keys(categoryTotals).map(k => k.charAt(0).toUpperCase() + k.slice(1));
  const data = Object.values(categoryTotals);
  const colors = Object.keys(categoryTotals).map(k => CATEGORY_COLORS[k] || '#64748B');

  const total = data.reduce((a, b) => a + b, 0);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94A3B8',
          font: { family: 'Inter', size: 12 },
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 10,
        },
      },
      tooltip: {
        backgroundColor: '#1E293B',
        titleColor: '#F8FAFC',
        bodyColor: '#94A3B8',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          label: (ctx) => `${ctx.label}: $${ctx.raw.toFixed(2)} (${((ctx.raw / total) * 100).toFixed(1)}%)`,
        },
      },
    },
  };

  const chartData = {
    labels,
    datasets: [{
      data,
      backgroundColor: colors,
      borderColor: colors.map(c => c + '40'),
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  const barData = {
    labels,
    datasets: [{
      label: 'Amount ($)',
      data,
      backgroundColor: colors.map(c => c + 'CC'),
      borderColor: colors,
      borderWidth: 1,
      borderRadius: 6,
    }],
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#94A3B8', font: { family: 'Inter' } },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#94A3B8', font: { family: 'Inter' }, callback: v => `$${v}` },
      },
    },
  };

  return (
    <div className="budget-chart-container">
      <div className="budget-total">
        <span className="budget-total-label">Total Budget</span>
        <span className="budget-total-value">${total.toFixed(2)}</span>
        <span className="budget-total-currency">{budget.currency || 'USD'}</span>
      </div>
      <div className="budget-chart-wrapper">
        {type === 'pie' ? (
          <Pie data={chartData} options={chartOptions} />
        ) : (
          <Bar data={barData} options={barOptions} />
        )}
      </div>
    </div>
  );
}
