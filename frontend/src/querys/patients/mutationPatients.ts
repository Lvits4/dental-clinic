import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { patientsApi } from '../../requests/patients.api';
import { HttpError } from '../../helpers/http';
import type { CreatePatientDto, PaginatedResponse, Patient, UpdatePatientDto } from '../../types';

function isPaginatedPatientList(data: unknown): data is PaginatedResponse<Patient> {
  if (!data || typeof data !== 'object') return false;
  const o = data as PaginatedResponse<Patient>;
  return Array.isArray(o.data) && o.meta != null && typeof o.meta.totalItems === 'number';
}

function stripPatientFromPaginatedCaches(old: unknown, id: string): unknown {
  if (!isPaginatedPatientList(old)) return old;
  const had = old.data.some((p) => p.id === id);
  if (!had) return old;
  const newTotal = Math.max(0, old.meta.totalItems - 1);
  const limit = Math.max(1, old.meta.limit);
  return {
    ...old,
    data: old.data.filter((p) => p.id !== id),
    meta: {
      ...old.meta,
      totalItems: newTotal,
      totalPages: Math.max(1, Math.ceil(newTotal / limit)),
    },
  };
}

type PatientMutationNavOptions = { skipNavigation?: boolean };

export const useCreatePatient = (options?: PatientMutationNavOptions) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreatePatientDto) => patientsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success('Paciente creado exitosamente');
      if (!options?.skipNavigation) {
        navigate('/patients', { viewTransition: true });
      }
    },
    onError: (error: Error) => {
      if (error instanceof HttpError) {
        const msg = Array.isArray(error.details) ? error.details[0] : error.details || error.message;
        toast.error(msg);
      } else {
        toast.error('Error al crear el paciente');
      }
    },
  });
};

export const useUpdatePatient = (id: string, options?: PatientMutationNavOptions) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: UpdatePatientDto) => patientsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patients', id] });
      toast.success('Paciente actualizado exitosamente');
      if (!options?.skipNavigation) {
        navigate(`/patients/${id}`, { viewTransition: true });
      }
    },
    onError: (error: Error) => {
      if (error instanceof HttpError) {
        const msg = Array.isArray(error.details) ? error.details[0] : error.details || error.message;
        toast.error(msg);
      } else {
        toast.error('Error al actualizar el paciente');
      }
    },
  });
};

export const useDeletePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => patientsApi.deactivate(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['patients'] });
      const previousEntries = queryClient.getQueriesData({ queryKey: ['patients'] });
      queryClient.setQueriesData({ queryKey: ['patients'] }, (old) => stripPatientFromPaginatedCaches(old, id));
      return { previousEntries };
    },
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: ['patients', id] });
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success('Paciente eliminado de la lista');
    },
    onError: (error: Error, _id, context) => {
      const prev = context?.previousEntries;
      if (prev) {
        prev.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      if (error instanceof HttpError) {
        const msg = Array.isArray(error.details) ? error.details[0] : error.details || error.message;
        toast.error(msg);
      } else {
        toast.error('Error al eliminar el paciente');
      }
    },
  });
};

