import { http } from '../helpers/http';
import { ENDPOINTS } from '../config/api';
import type { User, LoginDto, LoginResponse, RegisterDto } from '../types';

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
