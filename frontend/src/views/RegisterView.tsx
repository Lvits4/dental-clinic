import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button, Input } from '../components/ui';
import { useRegister } from '../querys/auth/mutationAuth';
import type { RegisterFormErrors } from '../types';

// Solo letras, espacios y acentos
const TEXT_ONLY_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
// Username: letras, numeros, guiones y guion bajo
const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;
// Email basico
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-8">
      <div className="w-full max-w-sm">
        {/* Logo / Marca */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Crear Cuenta</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Completa los datos para registrarte</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
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
            />

            <Input
              label="Correo electronico"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
              error={errors.email}
              autoComplete="email"
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
                  autoComplete="new-password"
                  className={[
                    'w-full rounded-lg border px-3 py-2 pr-10 text-sm',
                    'bg-white dark:bg-slate-800 text-slate-900 dark:text-white',
                    'placeholder-slate-400 dark:placeholder-slate-500',
                    'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent',
                    'transition-colors',
                    errors.password
                      ? 'border-red-400 dark:border-red-500'
                      : 'border-slate-300 dark:border-slate-600',
                  ].join(' ')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              loading={registerMutation.isPending}
              className="w-full"
            >
              Registrarse
            </Button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
          Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
          >
            Inicia sesion
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterView;
