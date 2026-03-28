import { useQuery } from '@tanstack/react-query';
import { authApi } from '../../requests/auth.api';
import type { User } from '../../types';

export const useCurrentUser = () => {
  return useQuery<User>({
    queryKey: ['auth', 'profile'],
    queryFn: () => authApi.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: false,
  });
};
