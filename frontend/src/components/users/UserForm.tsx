import { useState, type FormEvent } from 'react';
import { Input, Select, Button } from '../ui';
import type { User } from '../../types';
import type { CreateUserDto, UpdateUserDto } from '../../requests/users.api';
import { Role } from '../../enums';

const ROLE_OPTIONS = [
  { value: Role.ADMIN, label: 'Administrador' },
  { value: Role.DOCTOR, label: 'Doctor' },
  { value: Role.RECEPTIONIST, label: 'Recepcionista' },
];

interface UserFormErrors {
  fullName?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateCreate(data: CreateUserDto): UserFormErrors {
  const errors: UserFormErrors = {};
  if (!data.fullName.trim()) errors.fullName = 'El nombre completo es obligatorio';
  if (!data.username.trim()) errors.username = 'El nombre de usuario es obligatorio';
  if (!data.email.trim()) errors.email = 'El correo es obligatorio';
  else if (!EMAIL_REGEX.test(data.email.trim())) errors.email = 'Formato de correo inválido';
  if (!data.password.trim()) errors.password = 'La contraseña es obligatoria';
  else if (data.password.length < 6) errors.password = 'Mínimo 6 caracteres';
  if (!data.role) errors.role = 'El rol es obligatorio';
  return errors;
}

function validateUpdate(data: UpdateUserDto): UserFormErrors {
  const errors: UserFormErrors = {};
  if (data.fullName !== undefined && !data.fullName.trim()) errors.fullName = 'El nombre completo es obligatorio';
  if (data.username !== undefined && !data.username.trim()) errors.username = 'El nombre de usuario es obligatorio';
  if (data.email !== undefined) {
    if (!data.email.trim()) errors.email = 'El correo es obligatorio';
    else if (!EMAIL_REGEX.test(data.email.trim())) errors.email = 'Formato de correo inválido';
  }
  return errors;
}

interface UserFormCreateProps {
  mode: 'create';
  onSubmit: (data: CreateUserDto) => void;
  loading?: boolean;
}

interface UserFormEditProps {
  mode: 'edit';
  initialData: User;
  onSubmit: (data: UpdateUserDto) => void;
  loading?: boolean;
}

type UserFormProps = UserFormCreateProps | UserFormEditProps;

const UserForm = (props: UserFormProps) => {
  const isEdit = props.mode === 'edit';
  const initial = isEdit ? props.initialData : undefined;

  const [fullName, setFullName] = useState(initial?.fullName || '');
  const [username, setUsername] = useState(initial?.username || '');
  const [email, setEmail] = useState(initial?.email || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(initial?.role || Role.RECEPTIONIST);
  const [errors, setErrors] = useState<UserFormErrors>({});

  const clearError = (field: keyof UserFormErrors) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (isEdit) {
      const data: UpdateUserDto = {
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        role,
      };
      const validationErrors = validateUpdate(data);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      (props as UserFormEditProps).onSubmit(data);
    } else {
      const data: CreateUserDto = {
        fullName: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
        role,
      };
      const validationErrors = validateCreate(data);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      (props as UserFormCreateProps).onSubmit(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Datos del usuario
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nombre completo *"
            placeholder="María González"
            value={fullName}
            onChange={(e) => { setFullName(e.target.value); clearError('fullName'); }}
            error={errors.fullName}
            autoFocus
          />
          <Input
            label="Nombre de usuario *"
            placeholder="mgonzalez"
            value={username}
            onChange={(e) => { setUsername(e.target.value); clearError('username'); }}
            error={errors.username}
          />
          <Input
            label="Correo electrónico *"
            type="email"
            placeholder="usuario@clinica.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
            error={errors.email}
          />
          <Select
            label="Rol *"
            options={ROLE_OPTIONS}
            value={role}
            onChange={(e) => { setRole(e.target.value as Role); clearError('role'); }}
            error={errors.role}
          />
          {!isEdit && (
            <Input
              label="Contraseña *"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
              error={errors.password}
            />
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={props.loading}>
          {isEdit ? 'Guardar cambios' : 'Crear usuario'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
