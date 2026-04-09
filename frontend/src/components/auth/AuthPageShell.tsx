import type { ReactNode } from 'react';
import logoInicio from '../../assets/logo-inicio.png';

type AuthPageShellProps = {
  title: string;
  description: string;
  maxWidthClass?: string;
  footer?: ReactNode;
  children: ReactNode;
};

/**
 * Envuelve login/registro: en movil, tarjeta con franja de marca arriba;
 * en lg+, el panel izquierdo del layout lleva la marca y aqui solo queda el formulario limpio.
 */
const AuthPageShell = ({
  title,
  description,
  maxWidthClass = 'max-w-md',
  footer,
  children,
}: AuthPageShellProps) => (
  <div className={`mx-auto w-full ${maxWidthClass}`}>
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_24px_80px_-12px_rgba(15,23,42,0.12)] dark:border-slate-800 dark:bg-slate-900 dark:shadow-[0_24px_80px_-12px_rgba(0,0,0,0.45)] lg:rounded-3xl lg:border-0 lg:bg-transparent lg:shadow-none dark:lg:bg-transparent dark:lg:shadow-none">
      {/* Cabecera de marca solo en pantallas pequeñas (en lg el aside muestra la marca) */}
      <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 px-6 py-8 text-center lg:hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          aria-hidden="true"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative mx-auto flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl bg-white/20 shadow-inner ring-1 ring-white/30 backdrop-blur-sm">
          <img src={logoInicio} alt="" className="h-11 w-auto max-w-[3rem] object-contain drop-shadow-sm" />
        </div>
        <p className="mt-4 text-lg font-semibold tracking-tight text-white">SmileCare</p>
        <p className="mt-1 text-sm text-emerald-100/85">Gestion dental en un solo lugar</p>
      </div>

      <div className="p-6 sm:p-8 lg:px-2 lg:py-0 xl:px-4">
        <header className="mb-6 lg:mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-[1.65rem]">
            {title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{description}</p>
        </header>
        {children}
      </div>
    </div>
    {footer}
  </div>
);

export default AuthPageShell;
