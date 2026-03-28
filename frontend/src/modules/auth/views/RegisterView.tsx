import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';
import { validateRegister, TEXT_ONLY_REGEX, USERNAME_REGEX } from '../validations/auth.validations';
import type { RegisterFormErrors } from '../types/auth.types';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';
import PasswordInput from '../../../shared/components/ui/PasswordInput';

export default function RegisterView() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Crear Cuenta
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre completo"
          type="text"
          placeholder="Juan Pérez"
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
          label="Correo electrónico"
          type="email"
          placeholder="correo@ejemplo.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
          error={errors.email}
          autoComplete="email"
        />

        <PasswordInput
          label="Contraseña"
          placeholder="••••••••"
          value={password}
          onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
          error={errors.password}
          autoComplete="new-password"
        />

        <Button
          type="submit"
          loading={registerMutation.isPending}
          className="w-full"
        >
          Registrarse
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        ¿Ya tienes cuenta?{' '}
        <Link
          to="/login"
          className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
