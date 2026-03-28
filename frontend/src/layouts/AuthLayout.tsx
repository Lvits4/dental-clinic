import { Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

const AuthLayout = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 transition-colors">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 rounded-lg text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
        aria-label="Cambiar tema"
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>

      {/* Logo */}
      <div className="mb-8 text-center">
        <span className="text-5xl" role="img" aria-label="Diente">
          🦷
        </span>
        <h1 className="mt-3 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
          Rubia Dental
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Sistema de Gestión Dental
        </p>
      </div>

      {/* Auth form card */}
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
        <Outlet />
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-gray-400 dark:text-gray-600">
        &copy; {new Date().getFullYear()} Rubia Dental. Todos los derechos reservados.
      </p>
    </div>
  );
};

export default AuthLayout;
