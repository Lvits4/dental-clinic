import { useQuery } from '@tanstack/react-query';
import { doctorsApi } from '../requests/doctors.api';
import type { DoctorFilters } from '../types/doctor.types';

export const useDoctorsList = (filters: DoctorFilters = {}) => {
  return useQuery({
    queryKey: ['doctors', filters],
    queryFn: () => doctorsApi.getAll(filters),
  });
};
