import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../../shared/components/feedback/Toast';
import { authApi } from '../services/auth.api';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';

interface FormErrors {
  fullName?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterView() {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const toast = useToast();
  const navigate = useNavigate();

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!fullName.trim()) newErrors.fullName = 'El nombre es obligatorio';
    else if (fullName.trim().length < 3) newErrors.fullName = 'Mínimo 3 caracteres';

    if (!username.trim()) newErrors.username = 'El usuario es obligatorio';
    else if (username.trim().length < 3) newErrors.username = 'Mínimo 3 caracteres';

    if (!email.trim()) newErrors.email = 'El correo es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Correo inválido';

    if (!password) newErrors.password = 'La contraseña es obligatoria';
    else if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres';

    if (password !== confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await authApi.register({
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      toast.success('Cuenta creada exitosamente. Ahora inicia sesión.');
      navigate('/login');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Error al crear la cuenta';
      toast.error(message);
    } finally {
      setLoading(false);
    }
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
          onChange={(e) => { setFullName(e.target.value); clearError('fullName'); }}
          error={errors.fullName}
          autoFocus
        />

        <Input
          label="Usuario"
          type="text"
          placeholder="juan_perez"
          value={username}
          onChange={(e) => { setUsername(e.target.value); clearError('username'); }}
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

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
          error={errors.password}
          autoComplete="new-password"
        />

        <Input
          label="Confirmar contraseña"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => { setConfirmPassword(e.target.value); clearError('confirmPassword'); }}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <Button
          type="submit"
          loading={loading}
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
