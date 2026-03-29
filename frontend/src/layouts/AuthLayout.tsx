import { Outlet, useLocation } from 'react-router-dom';
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

/* Icono de muela estilizado */
const ToothIcon = () => (
  <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C9.243 2 7 4.243 7 7c0 1.642.8 3.093 2.024 4H7.5C5.015 11 3 13.015 3 15.5c0 2.063 1.398 3.794 3.293 4.333C6.577 20.416 7 21 7.5 21h9c.5 0 .923-.584 1.207-1.167C19.602 19.294 21 17.563 21 15.5c0-2.485-2.015-4.5-4.5-4.5h-1.524C16.2 10.093 17 8.642 17 7c0-2.757-2.243-5-5-5z" />
  </svg>
);

const AuthLayout = () => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const isRegister = location.pathname.includes('register');

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ── Panel izquierdo: Branding ── */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[520px] relative overflow-hidden flex-col justify-between bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 dark:from-emerald-900 dark:via-emerald-950 dark:to-slate-950 p-10 xl:p-12">
        {/* Elementos decorativos */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute top-1/3 -right-16 w-56 h-56 rounded-full bg-teal-400/10 blur-2xl" />
          <div className="absolute -bottom-16 left-1/4 w-64 h-64 rounded-full bg-emerald-300/10 blur-3xl" />
          {/* Patron de puntos sutil */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        {/* Logo y marca */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/10">
              <ToothIcon />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Rubia Dental</h1>
              <p className="text-emerald-200/70 text-xs">Sistema de Gestion Dental</p>
            </div>
          </div>
        </div>

        {/* Contenido central */}
        <div className="relative z-10 flex-1 flex flex-col justify-center -mt-10">
          <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-4">
            {isRegister
              ? 'Comienza a gestionar tu clinica'
              : 'Bienvenido de vuelta'}
          </h2>
          <p className="text-emerald-100/70 text-base leading-relaxed max-w-sm">
            {isRegister
              ? 'Registra tu cuenta y accede a todas las herramientas para administrar pacientes, citas y tratamientos.'
              : 'Inicia sesion para continuar administrando tus pacientes, citas y tratamientos dentales.'}
          </p>

          {/* Feature highlights */}
          <div className="mt-10 space-y-4">
            {[
              { icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2', label: 'Historiales clinicos completos' },
              { icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', label: 'Agenda de citas inteligente' },
              { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', label: 'Reportes y estadisticas' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                  <svg className="w-4.5 h-4.5 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <span className="text-sm text-emerald-100/80">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer del panel */}
        <div className="relative z-10">
          <p className="text-[11px] text-emerald-200/40">
            &copy; {new Date().getFullYear()} Rubia Dental. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* ── Panel derecho: Formulario ── */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0 bg-slate-50 dark:bg-slate-950 relative">
        {/* Fondo decorativo sutil */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 right-0 w-96 h-96 rounded-full bg-emerald-50/60 dark:bg-emerald-950/20 blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-72 h-72 rounded-full bg-teal-50/40 dark:bg-teal-950/10 blur-3xl" />
        </div>

        {/* Theme toggle */}
        <div className="relative z-10 flex justify-end p-4 lg:p-6">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-slate-800/60 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            aria-label="Cambiar tema"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>

        {/* Form area */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-5 pb-8 sm:px-8">
          <div className="w-full max-w-[420px] animate-fade-in-up">
            {/* Logo mobile only */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-4 shadow-lg shadow-emerald-500/20">
                <ToothIcon />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                Rubia Dental
              </h1>
            </div>

            <Outlet />
          </div>
        </div>

        {/* Footer mobile */}
        <div className="lg:hidden relative z-10 pb-6 text-center">
          <p className="text-[11px] text-slate-400 dark:text-slate-600">
            &copy; {new Date().getFullYear()} Rubia Dental. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
