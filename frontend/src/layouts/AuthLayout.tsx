import { Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

const AuthLayout = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 transition-colors">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-emerald-100/40 dark:bg-emerald-900/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-teal-100/30 dark:bg-teal-900/10 blur-3xl" />
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2.5 rounded-xl text-slate-500 hover:bg-white/60 dark:text-slate-400 dark:hover:bg-slate-800/60 transition-all duration-200 backdrop-blur-sm"
        aria-label="Cambiar tema"
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>

      {/* Logo */}
      <div className="relative mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-5 shadow-lg shadow-emerald-500/25">
          <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C9.243 2 7 4.243 7 7c0 1.642.8 3.093 2.024 4H7.5C5.015 11 3 13.015 3 15.5c0 2.063 1.398 3.794 3.293 4.333C6.577 20.416 7 21 7.5 21h9c.5 0 .923-.584 1.207-1.167C19.602 19.294 21 17.563 21 15.5c0-2.485-2.015-4.5-4.5-4.5h-1.524C16.2 10.093 17 8.642 17 7c0-2.757-2.243-5-5-5z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
          Rubia Dental
        </h1>
        <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Sistema de Gestion Dental
        </p>
      </div>

      {/* Auth form card */}
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 p-7">
        <Outlet />
      </div>

      {/* Footer */}
      <p className="relative mt-8 text-[11px] text-slate-400 dark:text-slate-600">
        &copy; {new Date().getFullYear()} Rubia Dental. Todos los derechos reservados.
      </p>
    </div>
  );
};

export default AuthLayout;
