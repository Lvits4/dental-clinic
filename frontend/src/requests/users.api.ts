import { http } from '../helpers/http';
import type { PaginatedResponse, User, UserFilters } from '../types';
import type { Role } from '../enums';

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: Role;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  password?: string;
  fullName?: string;
  role?: Role;
  isActive?: boolean;
}

export const usersApi = {
  getAll(filters: UserFilters = {}): Promise<PaginatedResponse<User>> {
    return http.get<PaginatedResponse<User>>('/users', {
      page: filters.page,
      limit: filters.limit,
      search: filters.search,
      role: filters.role,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    } as Record<string, string | number | undefined>);
  },

  getById(id: string): Promise<User> {
    return http.get<User>(`/users/${id}`);
  },

  create(data: CreateUserDto): Promise<User> {
    return http.post<User>('/users', data);
  },

  update(id: string, data: UpdateUserDto): Promise<User> {
    return http.patch<User>(`/users/${id}`, data);
  },

  delete(id: string): Promise<User> {
    return http.delete<User>(`/users/${id}`);
  },
};
