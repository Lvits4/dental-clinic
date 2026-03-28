import { http } from '../../../common/utils/http';
import { ENDPOINTS } from '../../../common/constants/api';
import type { User } from '../../../common/types/common';
import type { LoginDto, LoginResponse, RegisterDto } from '../types/auth.types';

export const authApi = {
  login(credentials: LoginDto): Promise<LoginResponse> {
    return http.post<LoginResponse>(ENDPOINTS.LOGIN, credentials);
  },

  register(data: RegisterDto): Promise<User> {
    return http.post<User>(ENDPOINTS.REGISTER, data);
  },

  getProfile(): Promise<User> {
    return http.get<User>(ENDPOINTS.PROFILE);
  },
};
