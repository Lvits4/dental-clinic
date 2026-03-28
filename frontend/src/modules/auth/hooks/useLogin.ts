import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../common/global-context/AuthContext';
import { useToast } from '../../../common/components/Toast/Toast';
import { authApi } from '../requests/auth.api';
import type { LoginDto } from '../types/auth.types';

export const useLogin = () => {
  const { setSession } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginDto) => authApi.login(credentials),
    onSuccess: (data) => {
      setSession(data.accessToken, data.user);
      toast.success('Inicio de sesión exitoso');
      navigate('/');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Credenciales inválidas');
    },
  });
};
