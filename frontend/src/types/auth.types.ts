import type { User } from './user.types';

// Credenciales de login
export interface LoginDto {
  username: string;
  password: string;
}

// Respuesta de login del backend
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

// Errores del formulario de login
export interface LoginFormErrors {
  username?: string;
  password?: string;
}

// Errores del formulario de registro
export interface RegisterFormErrors {
  fullName?: string;
  username?: string;
  email?: string;
  password?: string;
}
