import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../shared/components/feedback/Toast';
import { authApi } from '../services/auth.api';
import type { RegisterDto } from '../types/auth.types';

export function useRegister() {
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
}
