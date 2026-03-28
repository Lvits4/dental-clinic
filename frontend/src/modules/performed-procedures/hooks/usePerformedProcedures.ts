import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { performedProceduresApi } from '../services/performed-procedures.api';
import type { CreatePerformedProcedureDto, PerformedProcedureFilters } from '../types/performed-procedure.types';
import { HttpError } from '../../../shared/utils/http';

export function usePerformedProceduresList(filters: PerformedProcedureFilters = {}) {
  return useQuery({
    queryKey: ['performed-procedures', filters],
    queryFn: () => performedProceduresApi.getAll(filters),
  });
}

export function usePerformedProcedureDetail(id: string) {
  return useQuery({
    queryKey: ['performed-procedures', id],
    queryFn: () => performedProceduresApi.getById(id),
    enabled: !!id,
  });
}

export function useCreatePerformedProcedure() {
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
}
