import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center gap-2 p-2 rounded-lg transition-colors hover:bg-gray-800/50 dark:hover:bg-gray-700/50 ${className}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun size={20} className="text-gray-400 hover:text-white transition-colors" />
      ) : (
        <Moon size={20} className="text-gray-600 hover:text-gray-900 transition-colors" />
      )}
      {showLabel && (
        <span className="text-sm font-medium text-gray-400 dark:text-gray-300">
          {isDark ? 'Light' : 'Dark'}
        </span>
      )}
    </button>
  );
}
