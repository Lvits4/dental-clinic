import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { doctorsApi } from '../../requests/doctors.api';
import type { CreateDoctorDto, Doctor, PaginatedResponse, UpdateDoctorDto } from '../../types';
import { HttpError } from '../../helpers/http';

type DoctorMutationNavOptions = { skipNavigation?: boolean };

function isDoctorsListQueryKey(key: readonly unknown[]): boolean {
  return key[0] === 'doctors' && key[1] === 'list';
}

function stripDoctorFromList(old: unknown, id: string): unknown {
  if (old && typeof old === 'object' && 'data' in old && Array.isArray((old as PaginatedResponse<Doctor>).data)) {
    const pr = old as PaginatedResponse<Doctor>;
    const data = pr.data.filter((d) => d.id !== id);
    const removed = pr.data.length - data.length;
    const totalItems = Math.max(0, pr.meta.totalItems - removed);
    const limit = Math.max(1, pr.meta.limit);
    return {
      ...pr,
      data,
      meta: {
        ...pr.meta,
        totalItems,
        totalPages: Math.max(1, Math.ceil(totalItems / limit)),
      },
    };
  }
  if (Array.isArray(old)) return old.filter((d) => (d as Doctor).id !== id);
  return old;
}

export const useCreateDoctor = (options?: DoctorMutationNavOptions) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: CreateDoctorDto) => doctorsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast.success('Doctor creado exitosamente');
      if (!options?.skipNavigation) {
        navigate('/doctors', { viewTransition: true });
      }
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
};

export const useUpdateDoctor = (id: string, options?: DoctorMutationNavOptions) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: UpdateDoctorDto) => doctorsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['doctors', id] });
      toast.success('Doctor actualizado exitosamente');
      if (!options?.skipNavigation) {
        navigate('/doctors', { viewTransition: true });
      }
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
};

export const useActivateDoctor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => doctorsApi.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast.success('Doctor activado exitosamente');
    },
    onError: (error: Error) => {
      if (error instanceof HttpError) {
        const msg = Array.isArray(error.details) ? error.details[0] : error.details || error.message;
        toast.error(msg);
      } else {
        toast.error('Error al activar el doctor');
      }
    },
  });
};

export const useToggleDoctorStatus = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isActive: boolean) => doctorsApi.update(id, { isActive }),
    onSuccess: (_data, isActive) => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['doctors', id] });
      toast.success(isActive ? 'Doctor activado exitosamente' : 'Doctor desactivado exitosamente');
    },
    onError: (error: Error) => {
      if (error instanceof HttpError) {
        const msg = Array.isArray(error.details) ? error.details[0] : error.details || error.message;
        toast.error(msg);
      } else {
        toast.error('Error al cambiar el estado del doctor');
      }
    },
  });
};

export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();

  const listPredicate = (q: { queryKey: readonly unknown[] }) => isDoctorsListQueryKey(q.queryKey);

  return useMutation({
    mutationFn: (id: string) => doctorsApi.deactivate(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['doctors'] });
      const previousEntries = queryClient.getQueriesData({ predicate: listPredicate });
      queryClient.setQueriesData({ predicate: listPredicate }, (old) => stripDoctorFromList(old, id));
      return { previousEntries };
    },
    onSuccess: (_data, id) => {
      queryClient.removeQueries({ queryKey: ['doctors', id] });
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast.success('Doctor desactivado');
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
        toast.error('Error al desactivar el doctor');
      }
    },
  });
};
