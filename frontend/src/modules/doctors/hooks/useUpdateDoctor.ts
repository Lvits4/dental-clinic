import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { doctorsApi } from '../services/doctors.api';
import type { UpdateDoctorDto } from '../types/doctor.types';
import { HttpError } from '../../../shared/utils/http';

export function useUpdateDoctor(id: string) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: UpdateDoctorDto) => doctorsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['doctors', id] });
      toast.success('Doctor actualizado exitosamente');
      navigate(`/doctors/${id}`);
    },
    onError: (error: Error) => {
      if (error instanceof HttpError) {
        const msg = Array.isArray(error.details) ? error.details[0] : error.details || error.message;
        toast.error(msg);
      } else {
        toast.error('Error al actualizar el doctor');
      }
    },
  });
}
