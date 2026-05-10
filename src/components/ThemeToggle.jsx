import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full backdrop-blur-md bg-glass-light dark:bg-glass-dark border border-white/20 dark:border-white/10 hover:bg-white/40 dark:hover:bg-white/20 transition-all duration-200 group"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {isDark ? (
        <Sun size={18} className="text-yellow-300 group-hover:rotate-12 transition-transform" />
      ) : (
        <Moon size={18} className="text-purple-400 group-hover:rotate-12 transition-transform" />
      )}
    </button>
  );
}
