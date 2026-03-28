import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { doctorsApi } from '../services/doctors.api';
import type { CreateDoctorDto } from '../types/doctor.types';
import { HttpError } from '../../../shared/utils/http';

export function useCreateDoctor() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateDoctorDto) => doctorsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast.success('Doctor creado exitosamente');
      navigate('/doctors');
    },
    onError: (error: Error) => {
      if (error instanceof HttpError) {
        const msg = Array.isArray(error.details) ? error.details[0] : error.details || error.message;
        toast.error(msg);
      } else {
        toast.error('Error al crear el doctor');
      }
    },
  });
}
