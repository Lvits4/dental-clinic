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
  fullName: string;
  role: Role;
  isActive?: boolean;
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
  accessToken: string;
  user: User;
}

// DTO de registro
export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

// Error de la API
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
}
