// Respuesta genérica de la API
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Respuesta paginada
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Parámetros de paginación
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// Opciones para selects
export interface SelectOption {
  value: string;
  label: string;
}

// Usuario autenticado
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

// Roles del sistema
export enum Role {
  ADMIN = 'admin',
  DOCTOR = 'doctor',
  RECEPTIONIST = 'receptionist',
}

// Credenciales de login
export interface LoginDto {
  username: string;
  password: string;
}

// Respuesta de login
export interface LoginResponse {
  access_token: string;
  user: User;
}

// Error de la API
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
