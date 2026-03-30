import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import logoSidebar from '../assets/logo-sidebar.png';

const LOGO_COLAPSADO_URL = `${import.meta.env.BASE_URL}logo-colapsado.png`;
import { Role } from '../enums';

// ─── Iconos SVG inline ────────────────────────────────────────────────────────

const IconDashboard = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const IconPatients = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const IconAppointments = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const IconTreatments = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
    />
  </svg>
);

const IconDoctors = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const IconPlans = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const IconProcedures = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    />
  </svg>
);

const IconMore = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const IconClose = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/** Doble flecha hacia la derecha: espejo del icono de colapsar (sidebar abierto) */
const IconChevronsExpand = () => (
  <svg className="w-4.5 h-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M6 5l7 7-7 7" />
  </svg>
);

const IconSun = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const IconMoon = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

const IconUsers = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const IconLogout = () => (
  <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

// ─── Definicion de navegacion ─────────────────────────────────────────────────

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  end?: boolean;
  roles?: Role[];
}

/** Orden por prioridad de gestion: resumen -> agenda -> pacientes -> clinica -> planificacion -> registro -> equipo -> sistema */
const sidebarNavItems: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: <IconDashboard />, end: true },
  { to: '/appointments', label: 'Citas', icon: <IconAppointments /> },
  { to: '/patients', label: 'Pacientes', icon: <IconPatients /> },
  { to: '/treatments', label: 'Tratamientos', icon: <IconTreatments /> },
  { to: '/treatment-plans', label: 'Planes', icon: <IconPlans />, roles: [Role.ADMIN, Role.DOCTOR] },
  { to: '/performed-procedures', label: 'Procedimientos', icon: <IconProcedures />, roles: [Role.ADMIN, Role.DOCTOR] },
  { to: '/doctors', label: 'Doctores', icon: <IconDoctors />, roles: [Role.ADMIN] },
  { to: '/users', label: 'Usuarios', icon: <IconUsers />, roles: [Role.ADMIN] },
];

const filterByRole = (items: NavItem[], role: string | undefined) =>
  items.filter(item => !item.roles || (role && item.roles.includes(role as Role)));

/** Primeros cuatro del orden anterior: barra inferior movil + resto en drawer "Mas" */
const mobileBottomNavItems = sidebarNavItems.slice(0, 4);

// ─── Sidebar widths ───────────────────────────────────────────────────────────

const SIDEBAR_EXPANDED = 228;
/** Ancho colapsado: logo + boton expandir en cabecera */
const SIDEBAR_COLLAPSED = 80;

// ─── Sub-componentes ──────────────────────────────────────────────────────────

interface SidebarNavLinkProps {
  item: NavItem;
  collapsed: boolean;
}

const SidebarNavLink = ({ item, collapsed }: SidebarNavLinkProps) => (
  <NavLink
    to={item.to}
    end={item.end}
    title={collapsed ? item.label : undefined}
    className={({ isActive }) =>
      [
        'relative flex items-center font-medium transition-all duration-200 group cursor-pointer',
        collapsed
          ? isActive
            ? 'mx-auto size-10 shrink-0 justify-center rounded-full p-0'
            : 'justify-center rounded-md px-0 py-1.5'
          : isActive
            ? 'gap-3 rounded-md px-3 py-2'
            : 'gap-3 rounded-md px-3 py-2',
        isActive
          ? 'bg-emerald-50 dark:bg-emerald-900/25 text-emerald-700 dark:text-emerald-300 shadow-sm'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200',
      ].join(' ')
    }
  >
    {({ isActive }) => (
      <>
        {/* Franja activa solo con sidebar expandido */}
        {isActive && !collapsed && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-md bg-emerald-500 dark:bg-emerald-400" />
        )}
        <span className={`transition-colors duration-200 ${
          isActive
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
        }`}>
          {item.icon}
        </span>
        {!collapsed && (
          <span className="text-sm tracking-tight whitespace-nowrap overflow-hidden">{item.label}</span>
        )}
      </>
    )}
  </NavLink>
);

// ─── Componente principal ─────────────────────────────────────────────────────

const MainLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
    navigate('/login');
  };

  const visibleNavItems = filterByRole(sidebarNavItems, user?.role);
  const mobileMoreNavItems = visibleNavItems.filter(
    (item) => !mobileBottomNavItems.some((m) => m.to === item.to),
  );
  const userInitial = user?.fullName?.charAt(0)?.toUpperCase() ?? 'U';
  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">

      {/* ── SIDEBAR DESKTOP (>= md) ── */}
      <aside
        className="hidden md:flex flex-col fixed inset-y-0 left-0 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 z-30 transition-all duration-300"
        style={{ width: sidebarWidth }}
      >
        {/* Logo + toggle colapsar / expandir */}
        <div
          className={`border-b border-slate-100 dark:border-slate-800/80 shrink-0 ${
            collapsed
              ? 'flex flex-col items-center justify-center gap-1 px-2 py-2 min-h-[72px]'
              : 'flex h-[72px] items-center justify-between px-5'
          }`}
        >
          {collapsed ? (
            <>
              <button
                type="button"
                onClick={() => setCollapsed(false)}
                title="Expandir menu"
                className="size-9 shrink-0 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity duration-200 flex items-center justify-center"
              >
                <img src={LOGO_COLAPSADO_URL} alt="SmileCare" className="w-full h-full object-contain" />
              </button>
              <button
                type="button"
                onClick={() => setCollapsed(false)}
                aria-label="Expandir menu"
                title="Expandir menu"
                className="shrink-0 p-1.5 rounded-md text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200 cursor-pointer"
              >
                <IconChevronsExpand />
              </button>
            </>
          ) : (
            /* Cuando esta expandido: logo + boton colapsar */
            <>
              <div className="flex items-center min-w-0 flex-1 mr-2">
                <img
                  src={logoSidebar}
                  alt="SmileCare"
                  className="h-9 w-auto max-w-[200px] object-contain object-left shrink-0"
                />
              </div>
              <button
                onClick={() => setCollapsed(true)}
                title="Colapsar menu"
                className="p-1.5 rounded-md text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 transition-all duration-200 cursor-pointer"
              >
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Navegacion */}
        <nav className={`flex-1 overflow-y-auto py-4 space-y-0 ${collapsed ? 'px-2' : 'px-3'}`}>
          {visibleNavItems.map((item) => (
            <SidebarNavLink key={item.to} item={item} collapsed={collapsed} />
          ))}
        </nav>

        {/* Footer del sidebar */}
        <div className={`py-2.5 border-t border-slate-100 dark:border-slate-800/80 space-y-0 ${collapsed ? 'px-2' : 'px-3'}`}>
          {/* Toggle tema */}
          <button
            onClick={toggleTheme}
            title={collapsed ? (isDark ? 'Modo claro' : 'Modo oscuro') : undefined}
            className={`w-full flex items-center rounded-md text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all duration-200 cursor-pointer ${
              collapsed ? 'justify-center py-2 px-0' : 'gap-3 px-3 py-2'
            }`}
          >
            <span className="text-slate-400 dark:text-slate-500">
              {isDark ? <IconSun /> : <IconMoon />}
            </span>
            {!collapsed && <span>{isDark ? 'Modo claro' : 'Modo oscuro'}</span>}
          </button>

          <NavLink
            to="/account"
            aria-label="Ir a mi cuenta"
            title={collapsed ? (user?.fullName ?? 'Mi cuenta') : undefined}
            className={({ isActive }) =>
              [
                'text-sm font-medium transition-all duration-200 cursor-pointer no-underline outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900',
                collapsed
                  ? isActive
                    ? 'flex size-10 shrink-0 justify-center items-center rounded-full bg-emerald-50 dark:bg-emerald-900/25 shadow-sm mx-auto'
                    : 'flex w-full justify-center py-1.5 rounded-md'
                  : 'w-full flex items-center gap-2 px-2 py-2 border rounded-md',
                isActive
                  ? collapsed
                    ? ''
                    : 'bg-emerald-50 dark:bg-emerald-900/25 border-emerald-200/70 dark:border-emerald-800/50'
                  : collapsed
                    ? ''
                    : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800/80',
              ].join(' ')
            }
          >
            {({ isActive }) =>
              collapsed ? (
                <div
                  className={`w-8 h-8 rounded-full bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-semibold shrink-0 shadow-sm ${
                    isActive ? 'ring-2 ring-emerald-400/80 ring-offset-2 ring-offset-emerald-50 dark:ring-offset-emerald-900/25' : ''
                  }`}
                >
                  {userInitial}
                </div>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-md bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-semibold shrink-0 shadow-sm">
                    {userInitial}
                  </div>
                  <div className="flex-1 min-w-0 leading-tight">
                    <p
                      className={`text-xs font-semibold truncate tracking-tight ${
                        isActive
                          ? 'text-emerald-800 dark:text-emerald-200'
                          : 'text-slate-800 dark:text-white'
                      }`}
                    >
                      {user?.fullName ?? 'Usuario'}
                    </p>
                    <p
                      className={`text-[11px] truncate mt-0.5 ${
                        isActive
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {user?.email}
                    </p>
                  </div>
                </>
              )
            }
          </NavLink>

          {/* Cerrar sesion */}
          <button
            onClick={handleLogout}
            title={collapsed ? 'Cerrar sesion' : undefined}
            className={`w-full flex items-center rounded-md text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/15 transition-all duration-200 cursor-pointer ${
              collapsed ? 'justify-center py-2 px-0' : 'gap-3 px-3 py-2'
            }`}
          >
            <IconLogout />
            {!collapsed && <span>Cerrar sesion</span>}
          </button>

        </div>
      </aside>

      {/* ── HEADER MOBILE (< md) ── */}
      <header className="md:hidden sticky top-0 z-20 flex items-center justify-between h-14 px-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200/60 dark:border-slate-800/60">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 shrink-0 overflow-hidden rounded-md flex items-center justify-center">
            <img src={LOGO_COLAPSADO_URL} alt="SmileCare" className="max-h-full max-w-full object-contain" />
          </div>
          <span className="text-base font-bold bg-linear-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
            SmileCare
          </span>
        </NavLink>

        {/* Avatar con dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-9 h-9 rounded-md bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 shadow-sm cursor-pointer"
            aria-label="Menu de usuario"
          >
            {userInitial}
          </button>

          {userMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setUserMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-md shadow-xl border border-slate-200/80 dark:border-slate-800 z-20 overflow-hidden">
                <NavLink
                  to="/account"
                  onClick={() => setUserMenuOpen(false)}
                  className={({ isActive }) =>
                    [
                      'block px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 transition-colors rounded-t-md',
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-900/25'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/80',
                    ].join(' ')
                  }
                >
                  {({ isActive }) => (
                    <>
                      <p
                        className={`text-sm font-semibold truncate ${
                          isActive
                            ? 'text-emerald-800 dark:text-emerald-200'
                            : 'text-slate-800 dark:text-white'
                        }`}
                      >
                        {user?.fullName ?? 'Usuario'}
                      </p>
                      <p
                        className={`text-xs truncate mt-0.5 ${
                          isActive
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {user?.email}
                      </p>
                    </>
                  )}
                </NavLink>
                <div className="p-1.5">
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="text-slate-400">
                      {isDark ? <IconSun /> : <IconMoon />}
                    </span>
                    <span>{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-md text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/15 transition-colors"
                  >
                    <IconLogout />
                    <span>Cerrar sesion</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <style>{`
        @media (min-width: 768px) {
          .main-content { margin-left: ${sidebarWidth}px; }
        }
      `}</style>
      <main className="main-content pb-20 md:pb-0 min-h-screen md:min-h-0 md:h-dvh flex flex-col md:overflow-y-auto transition-all duration-300">
        <div className="px-4 py-5 sm:px-6 sm:py-7 lg:px-10 max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0 min-w-0">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </main>

      {/* ── BOTTOM NAV MOBILE (< md) ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200/60 dark:border-slate-800/60 flex items-stretch h-16 safe-area-pb">
        {mobileBottomNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `relative flex-1 flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-all duration-200 min-h-[44px] ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-400 dark:text-slate-500'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`transition-all duration-200 ${
                  isActive
                    ? 'text-emerald-600 dark:text-emerald-400 scale-110'
                    : 'text-slate-400 dark:text-slate-500'
                }`}>
                  {item.icon}
                </span>
                <span className="leading-none">{item.label}</span>
                {isActive && (
                  <span className="absolute top-0 w-8 h-0.5 rounded-md bg-emerald-500 dark:bg-emerald-400" />
                )}
              </>
            )}
          </NavLink>
        ))}

        {mobileMoreNavItems.length > 0 && (
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 text-xs font-medium text-slate-400 dark:text-slate-500 min-h-[44px]"
            aria-label="Ver mas"
          >
            <span>
              <IconMore />
            </span>
            <span className="leading-none">Mas</span>
          </button>
        )}
      </nav>

      {/* ── DRAWER "MAS" MOBILE ── */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-30 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Panel deslizable desde abajo */}
          <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-slate-900 rounded-t-md shadow-2xl border-t border-slate-200/80 dark:border-slate-800 animate-slide-up">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-md bg-slate-200 dark:bg-slate-700" />
            </div>

            {/* Header del drawer */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white tracking-tight">
                Mas opciones
              </h3>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Cerrar"
              >
                <IconClose />
              </button>
            </div>

            {/* Resto de rutas (no estan en la barra inferior) */}
            <nav className="px-3 py-2 space-y-0 pb-8">
              {mobileMoreNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-emerald-50 dark:bg-emerald-900/25 text-emerald-700 dark:text-emerald-300'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        </>
      )}
    </div>
  );
};

export default MainLayout;
