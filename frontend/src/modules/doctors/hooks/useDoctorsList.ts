import { useQuery } from '@tanstack/react-query';
import { doctorsApi } from '../services/doctors.api';
import type { DoctorFilters } from '../types/doctor.types';

export function useDoctorsList(filters: DoctorFilters = {}) {
  return useQuery({
    queryKey: ['doctors', filters],
    queryFn: () => doctorsApi.getAll(filters),
  });
}
