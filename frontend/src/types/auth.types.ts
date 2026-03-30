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

/** Cuerpo PATCH /auth/profile (todos opcionales; currentPassword obligatorio si hay newPassword) */
export interface UpdateAccountDto {
  username?: string;
  email?: string;
  fullName?: string;
  newPassword?: string;
  currentPassword?: string;
}

export interface UpdateAccountResponse {
  user: User;
  accessToken?: string;
}
