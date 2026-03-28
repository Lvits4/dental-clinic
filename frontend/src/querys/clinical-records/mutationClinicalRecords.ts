import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { clinicalRecordsApi } from '../../requests/clinical-records.api';
import type { CreateClinicalRecordDto, UpdateClinicalRecordDto } from '../../types';
import { HttpError } from '../../helpers/http';

export const useCreateClinicalRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClinicalRecordDto) => clinicalRecordsApi.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clinical-records', data.patientId] });
      toast.success('Expediente clínico creado');
    },
    onError: (error: Error) => {
      if (error instanceof HttpError) {
        const msg = Array.isArray(error.details) ? error.details[0] : error.details || error.message;
        toast.error(msg);
      } else {
        toast.error('Error al crear expediente');
      }
    },
  });
};

export const useUpdateClinicalRecord = (id: string, patientId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateClinicalRecordDto) => clinicalRecordsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinical-records', patientId] });
      toast.success('Expediente clínico actualizado');
    },
    onError: (error: Error) => {
      if (error instanceof HttpError) {
        const msg = Array.isArray(error.details) ? error.details[0] : error.details || error.message;
        toast.error(msg);
      } else {
        toast.error('Error al actualizar expediente');
      }
    },
  });
};
