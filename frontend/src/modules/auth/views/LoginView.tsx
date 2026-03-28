import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import { validateLogin } from '../validations/auth.validations';
import type { LoginFormErrors } from '../types/auth.types';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import PasswordInput from '../../../shared/components/ui/PasswordInput';

export default function LoginView() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const loginMutation = useLogin();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = validateLogin(username, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    loginMutation.mutate({ username: username.trim(), password });
  };

  const clearError = (field: keyof LoginFormErrors) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Iniciar Sesión
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <PasswordInput
          label="Contraseña"
          placeholder="••••••••"
          value={password}
          onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
          error={errors.password}
          autoComplete="current-password"
        />

        <Button
          type="submit"
          loading={loginMutation.isPending}
          className="w-full"
        >
          Ingresar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        ¿No tienes cuenta?{' '}
        <Link
          to="/register"
          className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
        >
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}
