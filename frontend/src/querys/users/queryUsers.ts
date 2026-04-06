import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../../requests/users.api';
import type { UserFilters } from '../../types';

export const useUsersList = (filters: UserFilters = {}) => {
  return useQuery({
    queryKey: ['users', 'list', filters],
    queryFn: () => usersApi.getAll(filters),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};

export const useUserById = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });
};
