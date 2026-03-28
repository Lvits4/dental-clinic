import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import { useToast } from '../../../shared/components/feedback/Toast';
import Button from '../../../shared/components/ui/Button';
import Input from '../../../shared/components/ui/Input';

export default function LoginView() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!username.trim()) newErrors.username = 'El usuario es obligatorio';
    if (!password) newErrors.password = 'La contraseña es obligatoria';
    else if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await login({ username: username.trim(), password });
      toast.success('Inicio de sesión exitoso');
      navigate('/');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Credenciales inválidas';
      toast.error(message);
    } finally {
      setLoading(false);
    }
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
          onChange={(e) => {
            setUsername(e.target.value);
            if (errors.username) setErrors((prev) => ({ ...prev, username: undefined }));
          }}
          error={errors.username}
          autoComplete="username"
          autoFocus
        />

        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          error={errors.password}
          autoComplete="current-password"
        />

        <Button
          type="submit"
          loading={loading}
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
