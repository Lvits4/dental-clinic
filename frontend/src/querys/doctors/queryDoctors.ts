import { useQuery } from '@tanstack/react-query';
import { doctorsApi } from '../../requests/doctors.api';
import type { DoctorFilters } from '../../types';

export const useDoctorsList = (filters: DoctorFilters = {}) => {
  return useQuery({
    queryKey: ['doctors', filters],
    queryFn: () => doctorsApi.getAll(filters),
  });
};

export const useDoctorDetail = (id: string) => {
  return useQuery({
    queryKey: ['doctors', id],
    queryFn: () => doctorsApi.getById(id),
    enabled: !!id,
  });
};
