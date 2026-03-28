import { http } from '../../../shared/utils/http';
import { ENDPOINTS } from '../../../shared/constants/api';
import type { LoginDto, LoginResponse, RegisterDto, User } from '../../../shared/types/common';

export const authApi = {
  login(credentials: LoginDto): Promise<LoginResponse> {
    return http.post<LoginResponse>(ENDPOINTS.LOGIN, credentials);
  },

  register(data: RegisterDto): Promise<User> {
    return http.post<User>('/auth/register', data);
  },

  getProfile(): Promise<User> {
    return http.get<User>(ENDPOINTS.PROFILE);
  },
};
