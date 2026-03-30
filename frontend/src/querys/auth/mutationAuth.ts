import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../requests/auth.api';
import { useAuth } from '../../context/AuthContext';
import { HttpError } from '../../helpers/http';
import type { LoginDto, RegisterDto, UpdateAccountDto } from '../../types';

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

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  const { updateSession } = useAuth();

  return useMutation({
    mutationFn: (data: UpdateAccountDto) => authApi.updateAccount(data),
    onSuccess: async (res) => {
      if (res.accessToken) {
        localStorage.setItem('access_token', res.accessToken);
      }
      try {
        const profile = await authApi.getProfile();
        updateSession(profile, res.accessToken);
      } catch {
        if (res.user) {
          updateSession(res.user, res.accessToken);
        }
      }
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
      toast.success('Cuenta actualizada correctamente');
    },
    onError: (error: Error) => {
      if (error instanceof HttpError) {
        const msg = Array.isArray(error.details) ? error.details[0] : error.details || error.message;
        toast.error(String(msg));
      } else {
        toast.error('No se pudo actualizar la cuenta');
      }
    },
  });
};
