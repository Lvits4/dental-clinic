import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import AuthPageShell from '../components/auth/AuthPageShell';
import { Button, Input } from '../components/ui';
import { useRegister } from '../querys/auth/mutationAuth';
import type { RegisterFormErrors } from '../types';

const TEXT_ONLY_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegister(
  fullName: string,
  username: string,
  email: string,
  password: string,
): RegisterFormErrors {
  const errors: RegisterFormErrors = {};

  if (!fullName.trim()) {
    errors.fullName = 'El nombre es obligatorio';
  } else if (fullName.trim().length < 3) {
    errors.fullName = 'Minimo 3 caracteres';
  } else if (!TEXT_ONLY_REGEX.test(fullName.trim())) {
    errors.fullName = 'Solo se permiten letras y espacios';
  }

  if (!username.trim()) {
    errors.username = 'El usuario es obligatorio';
  } else if (username.trim().length < 3) {
    errors.username = 'Minimo 3 caracteres';
  } else if (!USERNAME_REGEX.test(username.trim())) {
    errors.username = 'Solo letras, numeros, guiones y guion bajo';
  }

  if (!email.trim()) {
    errors.email = 'El correo es obligatorio';
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Formato de correo invalido';
  }

  if (!password) {
    errors.password = 'La contrasena es obligatoria';
  } else if (password.length < 6) {
    errors.password = 'Minimo 6 caracteres';
  }

  return errors;
}

const RegisterView = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<RegisterFormErrors>({});

  const registerMutation = useRegister();

  const clearError = (field: keyof RegisterFormErrors) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateRegister(fullName, username, email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    registerMutation.mutate({
      fullName: fullName.trim(),
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      password,
    });
  };

  return (
    <AuthPageShell
      title="Crear cuenta"
      description="Completa tus datos para registrarte. En unos segundos podras entrar al sistema."
      maxWidthClass="max-w-xl"
      footer={
        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Ya tienes cuenta?{' '}
          <Link
            to="/login"
            viewTransition
            className="font-semibold text-emerald-600 underline-offset-2 hover:text-emerald-500 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            Inicia sesion
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Nombre completo"
          type="text"
          placeholder="Juan Perez"
          value={fullName}
          onChange={(e) => {
            const val = e.target.value;
            if (val === '' || TEXT_ONLY_REGEX.test(val)) setFullName(val);
            clearError('fullName');
          }}
          error={errors.fullName}
          autoFocus
          className="py-2"
          leftIcon={
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          }
        />

        <Input
          label="Usuario"
          type="text"
          placeholder="juan_perez"
          value={username}
          onChange={(e) => {
            const val = e.target.value;
            if (val === '' || USERNAME_REGEX.test(val)) setUsername(val);
            clearError('username');
          }}
          error={errors.username}
          autoComplete="username"
          className="py-2"
          leftIcon={
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
            </svg>
          }
        />

        <div className="sm:col-span-2">
          <Input
            label="Correo electronico"
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
            error={errors.email}
            autoComplete="email"
            className="py-2"
            leftIcon={
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            }
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Contrasena
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
              autoComplete="new-password"
              className={[
                'w-full rounded-lg border text-sm transition-all duration-200',
                'bg-white dark:bg-slate-800/50 text-slate-900 dark:text-white',
                'placeholder-slate-400 dark:placeholder-slate-500',
                'focus:outline-none focus:ring-2 focus:ring-offset-0',
                'pl-10 pr-11 py-2.5',
                errors.password
                  ? 'border-red-300 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 focus:border-emerald-500/60 focus:ring-emerald-500/20 dark:focus:border-emerald-500/50',
              ].join(' ')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
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
            <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
              <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.password}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <Button
            type="submit"
            loading={registerMutation.isPending}
            className="mt-1 w-full rounded-lg py-3! text-sm! font-semibold! shadow-sm"
          >
            Crear cuenta
          </Button>
        </div>
      </form>
    </AuthPageShell>
  );
};

export default RegisterView;
