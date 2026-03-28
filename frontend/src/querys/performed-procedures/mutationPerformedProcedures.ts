import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { performedProceduresApi } from '../../requests/performed-procedures.api';
import type { CreatePerformedProcedureDto } from '../../types';
import { HttpError } from '../../helpers/http';

export const useCreatePerformedProcedure = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreatePerformedProcedureDto) => performedProceduresApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performed-procedures'] });
      queryClient.invalidateQueries({ queryKey: ['treatment-plans'] });
      toast.success('Procedimiento registrado');
      navigate('/performed-procedures');
    },
    onError: (error: Error) => {
      if (error instanceof HttpError) {
        const msg = Array.isArray(error.details) ? error.details[0] : error.details || error.message;
        toast.error(msg);
      } else {
        toast.error('Error al registrar procedimiento');
      }
    },
  });
};
