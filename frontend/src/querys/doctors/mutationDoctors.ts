import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { doctorsApi } from '../../requests/doctors.api';
import type { CreateDoctorDto, Doctor, UpdateDoctorDto } from '../../types';
import { HttpError } from '../../helpers/http';

type DoctorMutationNavOptions = { skipNavigation?: boolean };

function isDoctorsListQueryKey(key: readonly unknown[]): boolean {
  return key[0] === 'doctors' && key.length === 2 && typeof key[1] === 'object' && key[1] !== null;
}

function stripDoctorFromList(old: unknown, id: string): unknown {
  if (!Array.isArray(old)) return old;
  return old.filter((d) => (d as Doctor).id !== id);
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
        navigate('/doctors');
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
        navigate('/doctors');
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
