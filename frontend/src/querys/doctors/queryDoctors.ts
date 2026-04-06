import { useQuery } from '@tanstack/react-query';
import { doctorsApi } from '../../requests/doctors.api';
import type { DoctorFilters } from '../../types';

export const useDoctorsList = (filters: DoctorFilters = {}) => {
  return useQuery({
    queryKey: ['doctors', 'list', filters],
    queryFn: () => doctorsApi.getAll(filters),
    staleTime: 1000 * 60 * 10,
    placeholderData: (previousData) => previousData,
  });
};

/** Opciones para formularios (hasta 100 activos por página). */
export const useDoctorsForSelect = () => {
  return useQuery({
    queryKey: ['doctors', 'select'],
    queryFn: () => doctorsApi.getAll({ page: 1, limit: 100, isActive: true }),
    select: (res) => res?.data ?? [],
    staleTime: 1000 * 60 * 10,
  });
};

export const useDoctorDetail = (id: string) => {
  return useQuery({
    queryKey: ['doctors', id],
    queryFn: () => doctorsApi.getById(id),
    enabled: !!id,
  });
};
