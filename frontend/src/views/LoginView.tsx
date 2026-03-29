import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from '../components/ui';
import { useLogin } from '../querys/auth/mutationAuth';
import type { LoginFormErrors } from '../types';

function validateLogin(username: string, password: string): LoginFormErrors {
  const errors: LoginFormErrors = {};
  if (!username.trim()) {
    errors.username = 'El usuario es obligatorio';
  }
  if (!password) {
    errors.password = 'La contrasena es obligatoria';
  } else if (password.length < 6) {
    errors.password = 'Minimo 6 caracteres';
  }
  return errors;
}

const LoginView = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const loginMutation = useLogin();

  const clearError = (field: keyof LoginFormErrors) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateLogin(username, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    loginMutation.mutate({ username: username.trim(), password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-emerald-100/40 dark:bg-emerald-900/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-teal-100/30 dark:bg-teal-900/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-[400px] animate-fade-in-up">
        {/* Logo / Marca */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-5 shadow-lg shadow-emerald-500/25">
            <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C9.243 2 7 4.243 7 7c0 1.642.8 3.093 2.024 4H7.5C5.015 11 3 13.015 3 15.5c0 2.063 1.398 3.794 3.293 4.333C6.577 20.416 7 21 7.5 21h9c.5 0 .923-.584 1.207-1.167C19.602 19.294 21 17.563 21 15.5c0-2.485-2.015-4.5-4.5-4.5h-1.524C16.2 10.093 17 8.642 17 7c0-2.757-2.243-5-5-5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
            Bienvenido de vuelta
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Inicia sesion en <span className="font-semibold text-emerald-600 dark:text-emerald-400">Rubia Dental</span>
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Usuario o correo"
              type="text"
              placeholder="tu_usuario o correo@ejemplo.com"
              value={username}
              onChange={(e) => { setUsername(e.target.value); clearError('username'); }}
              error={errors.username}
              autoComplete="username"
              autoFocus
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Contrasena
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
                  autoComplete="current-password"
                  className={[
                    'w-full rounded-xl border px-4 py-2.5 pr-11 text-sm',
                    'bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white',
                    'placeholder-slate-400 dark:placeholder-slate-500',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500',
                    'transition-all duration-200',
                    errors.password
                      ? 'border-red-400 dark:border-red-500'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600',
                  ].join(' ')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              loading={loginMutation.isPending}
              className="w-full !py-2.5 !text-sm !font-semibold !shadow-md !shadow-emerald-500/20"
            >
              Iniciar sesion
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          No tienes cuenta?{' '}
          <Link
            to="/register"
            className="font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
          >
            Registrate aqui
          </Link>
        </p>

        {/* Footer */}
        <p className="mt-8 text-center text-[11px] text-slate-400 dark:text-slate-600">
          &copy; {new Date().getFullYear()} Rubia Dental. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default LoginView;
