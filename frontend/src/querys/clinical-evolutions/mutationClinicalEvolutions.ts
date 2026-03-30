import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { clinicalEvolutionsApi } from '../../requests/clinical-evolutions.api';
import type { CreateClinicalEvolutionDto } from '../../types';
import { HttpError } from '../../helpers/http';

export type CreateClinicalEvolutionOptions = { skipNavigation?: boolean };

export const useCreateClinicalEvolution = (
  patientId: string,
  options?: CreateClinicalEvolutionOptions,
) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateClinicalEvolutionDto) => clinicalEvolutionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clinical-evolutions'] });
      toast.success('Evolución clínica registrada');
      if (!options?.skipNavigation) {
        navigate(`/patients/${patientId}/evolutions`);
      }
    },
    onError: (error: Error) => {
      if (error instanceof HttpError) {
        const msg = Array.isArray(error.details) ? error.details[0] : error.details || error.message;
        toast.error(msg);
      } else {
        toast.error('Error al registrar evolución');
      }
    },
  });
};
