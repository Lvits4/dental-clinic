import { Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import logoInicio from '../assets/logo-inicio.png';

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
    <div className="relative flex min-h-dvh flex-col bg-slate-50 dark:bg-slate-950">
      {/* Fondo decorativo sutil */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 right-0 h-96 w-96 rounded-md bg-emerald-50/60 blur-3xl dark:bg-emerald-950/20" />
        <div className="absolute bottom-0 -left-20 h-72 w-72 rounded-md bg-teal-50/40 blur-3xl dark:bg-teal-950/10" />
      </div>

      {/* Tema: flotante para no consumir una franja vertical */}
      <button
        type="button"
        onClick={toggleTheme}
        className="absolute right-3 top-3 z-20 rounded-md border border-transparent p-2 text-slate-400 transition-all duration-200 hover:border-slate-200 hover:bg-white hover:text-slate-600 dark:text-slate-500 dark:hover:border-slate-700 dark:hover:bg-slate-800/60 dark:hover:text-slate-300 sm:right-4 sm:top-4"
        aria-label="Cambiar tema"
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>

      {/* Contenido centrado en altura; scroll solo si el viewport es muy bajo (p. ej. teclado movil) */}
      <main className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain">
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-6 sm:px-6 sm:py-5">
          <div className="animate-fade-in-up w-full max-w-[420px]">
            <div className="mb-3 text-center sm:mb-4">
              <img
                src={logoInicio}
                alt="SmileCare"
                className="mx-auto h-11 w-auto max-w-[min(100%,220px)] object-contain sm:h-12"
              />
            </div>

            <Outlet />

            <p className="mt-3 text-center text-[10px] text-slate-400 dark:text-slate-600 sm:text-[11px]">
              &copy; {new Date().getFullYear()} SmileCare. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
