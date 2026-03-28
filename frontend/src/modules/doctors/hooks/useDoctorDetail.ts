import { useQuery } from '@tanstack/react-query';
import { doctorsApi } from '../requests/doctors.api';

export const useDoctorDetail = (id: string) => {
  return useQuery({
    queryKey: ['doctors', id],
    queryFn: () => doctorsApi.getById(id),
    enabled: !!id,
  });
};
