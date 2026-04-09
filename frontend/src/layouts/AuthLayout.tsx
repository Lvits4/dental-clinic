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
    <div className="relative min-h-dvh bg-slate-100 dark:bg-slate-950 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] xl:grid-cols-[minmax(0,1fr)_minmax(0,560px)]">
      {/* Panel de marca — solo escritorio */}
      <aside
        className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-10 xl:p-14"
        aria-label="Marca SmileCare"
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-24 top-1/4 h-[28rem] w-[28rem] rounded-full bg-emerald-500/15 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          aria-hidden="true"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='72' height='72' viewBox='0 0 72 72' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur-md">
              <img
                src={logoInicio}
                alt=""
                className="h-10 w-auto max-w-[2.5rem] object-contain"
              />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight text-white xl:text-3xl">SmileCare</p>
              <p className="mt-0.5 text-sm text-emerald-100/75">Software para clinicas dentales</p>
            </div>
          </div>
          <p className="mt-10 max-w-md text-lg leading-relaxed text-slate-300 xl:text-xl">
            Agenda, historias clinicas y planes de tratamiento en una experiencia clara y rapida.
          </p>
        </div>

        <p className="relative z-10 text-xs text-slate-500">
          &copy; {new Date().getFullYear()} SmileCare. Todos los derechos reservados.
        </p>
      </aside>

      {/* Columna del formulario */}
      <div className="relative flex min-h-dvh flex-col">
        <div className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden" aria-hidden="true">
          <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-emerald-400/25 blur-3xl dark:bg-emerald-900/20" />
          <div className="absolute bottom-0 -left-16 h-64 w-64 rounded-full bg-teal-300/20 blur-3xl dark:bg-teal-950/15" />
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="absolute right-3 top-3 z-20 rounded-xl border border-slate-200/80 bg-white/80 p-2.5 text-slate-500 shadow-sm backdrop-blur-sm transition-all duration-200 hover:border-slate-300 hover:text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200 sm:right-4 sm:top-4"
          aria-label="Cambiar tema"
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>

        <main className="relative z-10 flex min-h-0 flex-1 flex-col justify-center overflow-y-auto overscroll-y-contain px-4 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14 xl:px-16">
          <div className="animate-fade-in-up w-full">
            <Outlet />
          </div>
        </main>

        <p className="relative z-10 pb-6 text-center text-[10px] text-slate-400 dark:text-slate-600 sm:text-[11px] lg:hidden">
          &copy; {new Date().getFullYear()} SmileCare. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
