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
    <>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Iniciar sesion
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
          Ingresa tus credenciales para acceder al sistema
        </p>
      </div>

      {/* Form card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg shadow-slate-200/60 dark:shadow-none border border-slate-200/70 dark:border-slate-800 p-6 sm:p-7">
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
            leftIcon={
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            }
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Contrasena
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
                autoComplete="current-password"
                className={[
                  'w-full rounded-xl border text-sm transition-all duration-200',
                  'bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white',
                  'placeholder-slate-400 dark:placeholder-slate-500',
                  'focus:outline-none focus:ring-2 focus:ring-offset-0',
                  'pl-10 pr-11 py-2.5',
                  errors.password
                    ? 'border-red-300 dark:border-red-500 focus:ring-red-500/30 focus:border-red-500'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:ring-emerald-500/30 focus:border-emerald-500',
                ].join(' ')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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
            className="w-full !py-2.5 !text-sm !font-semibold"
          >
            Iniciar sesion
          </Button>
        </form>
      </div>

      {/* Footer link */}
      <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        No tienes cuenta?{' '}
        <Link
          to="/register"
          className="font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
        >
          Registrate aqui
        </Link>
      </p>
    </>
  );
};

export default LoginView;
