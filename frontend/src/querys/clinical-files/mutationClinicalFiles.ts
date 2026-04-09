import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { clinicalFilesApi } from '../../requests/clinical-files.api';
import { HttpError } from '../../helpers/http';

export const useUploadClinicalFile = (patientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, clinicalEvolutionId }: { file: File; clinicalEvolutionId?: string }) =>
      clinicalFilesApi.upload(patientId, file, clinicalEvolutionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinical-files'] });
      toast.success('Archivo subido exitosamente');
    },
    onError: (error: Error) => {
      if (error instanceof HttpError) {
        const msg = Array.isArray(error.details) ? error.details[0] : error.details || error.message;
        toast.error(msg);
      } else {
        toast.error('Error al subir archivo');
      }
    },
  });
};

export const useDeleteClinicalFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clinicalFilesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinical-files'] });
      toast.success('Archivo eliminado');
    },
    onError: (error: Error) => {
      queryClient.invalidateQueries({ queryKey: ['clinical-files'] });
      if (error instanceof HttpError) {
        const msg = Array.isArray(error.details) ? error.details[0] : error.details || error.message;
        toast.error(msg);
      } else {
        toast.error('Error al eliminar archivo');
      }
    },
  });
};
