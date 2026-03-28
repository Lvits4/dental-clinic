import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../../requests/users.api';

export const useUsersList = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
  });
};

export const useUserById = (id: string) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });
};
