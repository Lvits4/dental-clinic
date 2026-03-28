import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../requests/auth.api';
import { useAuth } from '../../context/AuthContext';
import type { LoginDto, RegisterDto } from '../../types';

export const useLogin = () => {
  const { setSession } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginDto) => authApi.login(credentials),
    onSuccess: (data) => {
      setSession(data.accessToken, data.user);
      toast.success('Inicio de sesion exitoso');
      navigate('/');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Credenciales invalidas');
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterDto) => authApi.register(data),
    onSuccess: () => {
      toast.success('Cuenta creada exitosamente. Ahora inicia sesion.');
      navigate('/login');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al crear la cuenta');
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuth();
  return logout;
};
