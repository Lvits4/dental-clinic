import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../common/components/Toast/Toast';
import { authApi } from '../requests/auth.api';
import type { RegisterDto } from '../types/auth.types';

export const useRegister = () => {
  const toast = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterDto) => authApi.register(data),
    onSuccess: () => {
      toast.success('Cuenta creada exitosamente. Ahora inicia sesión.');
      navigate('/login');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al crear la cuenta');
    },
  });
};
