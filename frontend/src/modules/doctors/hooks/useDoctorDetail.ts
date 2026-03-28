import { useQuery } from '@tanstack/react-query';
import { doctorsApi } from '../services/doctors.api';

export function useDoctorDetail(id: string) {
  return useQuery({
    queryKey: ['doctors', id],
    queryFn: () => doctorsApi.getById(id),
    enabled: !!id,
  });
}
