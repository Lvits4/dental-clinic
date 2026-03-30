import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { performedProceduresApi } from '../../requests/performed-procedures.api';
import type { CreatePerformedProcedureDto, UpdatePerformedProcedureDto } from '../../types';
import { HttpError } from '../../helpers/http';

export const useCreatePerformedProcedure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePerformedProcedureDto) => performedProceduresApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performed-procedures'] });
      queryClient.invalidateQueries({ queryKey: ['treatment-plans'] });
      toast.success('Procedimiento registrado');
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

export const useUpdatePerformedProcedure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePerformedProcedureDto }) =>
      performedProceduresApi.update(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['performed-procedures'] });
      queryClient.invalidateQueries({ queryKey: ['performed-procedures', id] });
      toast.success('Procedimiento actualizado');
    },
    onError: (error: Error) => {
      if (error instanceof HttpError) {
        const msg = Array.isArray(error.details) ? error.details[0] : error.details || error.message;
        toast.error(msg);
      } else {
        toast.error('Error al actualizar el procedimiento');
      }
    },
  });
};

export const useDeletePerformedProcedure = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => performedProceduresApi.delete(id),
    onSuccess: (_void, id) => {
      queryClient.invalidateQueries({ queryKey: ['performed-procedures'] });
      queryClient.removeQueries({ queryKey: ['performed-procedures', id] });
      toast.success('Procedimiento eliminado');
    },
    onError: (error: Error) => {
      if (error instanceof HttpError) {
        const msg = Array.isArray(error.details) ? error.details[0] : error.details || error.message;
        toast.error(msg);
      } else {
        toast.error('Error al eliminar el procedimiento');
      }
    },
  });
};
