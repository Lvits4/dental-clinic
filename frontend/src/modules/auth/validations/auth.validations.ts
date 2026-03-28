import type { LoginFormErrors, RegisterFormErrors } from '../types/auth.types';

// Solo letras, espacios y acentos
export const TEXT_ONLY_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

// Username: letras, números, guiones y guion bajo
export const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/;

// Email básico
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin(username: string, password: string): LoginFormErrors {
  const errors: LoginFormErrors = {};

  if (!username.trim()) {
    errors.username = 'El usuario es obligatorio';
  }

  if (!password) {
    errors.password = 'La contraseña es obligatoria';
  } else if (password.length < 6) {
    errors.password = 'Mínimo 6 caracteres';
  }

  return errors;
}

export function validateRegister(
  fullName: string,
  username: string,
  email: string,
  password: string,
): RegisterFormErrors {
  const errors: RegisterFormErrors = {};

  if (!fullName.trim()) {
    errors.fullName = 'El nombre es obligatorio';
  } else if (fullName.trim().length < 3) {
    errors.fullName = 'Mínimo 3 caracteres';
  } else if (!TEXT_ONLY_REGEX.test(fullName.trim())) {
    errors.fullName = 'Solo se permiten letras y espacios';
  }

  if (!username.trim()) {
    errors.username = 'El usuario es obligatorio';
  } else if (username.trim().length < 3) {
    errors.username = 'Mínimo 3 caracteres';
  } else if (!USERNAME_REGEX.test(username.trim())) {
    errors.username = 'Solo letras, números, guiones y guion bajo';
  }

  if (!email.trim()) {
    errors.email = 'El correo es obligatorio';
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Formato de correo inválido';
  }

  if (!password) {
    errors.password = 'La contraseña es obligatoria';
  } else if (password.length < 6) {
    errors.password = 'Mínimo 6 caracteres';
  }

  return errors;
}
