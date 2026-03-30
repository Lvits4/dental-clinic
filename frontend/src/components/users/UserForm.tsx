import { useState, type FormEvent } from 'react';
import { Input, Select, Button, FormSection } from '../ui';
import type { User } from '../../types';
import type { CreateUserDto, UpdateUserDto } from '../../requests/users.api';
import { Role } from '../../enums';

const EyeIcon = ({ open }: { open: boolean }) => open ? (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
) : (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

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
  if (data.password !== undefined && data.password.length > 0 && data.password.length < 6) {
    errors.password = 'Mínimo 6 caracteres';
  }
  return errors;
}

interface UserFormCreateProps {
  mode: 'create';
  onSubmit: (data: CreateUserDto) => void;
  loading?: boolean;
  onCancel?: () => void;
  submitLabel?: string;
}

interface UserFormEditProps {
  mode: 'edit';
  initialData: User;
  onSubmit: (data: UpdateUserDto) => void;
  loading?: boolean;
  onCancel?: () => void;
  submitLabel?: string;
}

type UserFormProps = UserFormCreateProps | UserFormEditProps;

/* ── Iconos de sección ── */
const IconUser = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UserForm = (props: UserFormProps) => {
  const isEdit = props.mode === 'edit';
  const initial = isEdit ? props.initialData : undefined;

  const [fullName, setFullName] = useState(initial?.fullName || '');
  const [username, setUsername] = useState(initial?.username || '');
  const [email, setEmail] = useState(initial?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        ...(password.trim() ? { password: password.trim() } : {}),
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormSection title="Datos del Usuario" icon={<IconUser />} description="Credenciales, rol y datos de acceso">
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
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
              error={errors.password}
              rightIcon={
                <button type="button" onClick={() => setShowPassword(v => !v)} className="flex items-center cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  <EyeIcon open={showPassword} />
                </button>
              }
            />
          )}
          {isEdit && (
            <Input
              label="Nueva contraseña"
              type={showPassword ? 'text' : 'password'}
              placeholder="Dejar vacío para no cambiar"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearError('password'); }}
              error={errors.password}
              helperText="Solo si deseas cambiar la contraseña actual"
              rightIcon={
                <button type="button" onClick={() => setShowPassword(v => !v)} className="flex items-center cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  <EyeIcon open={showPassword} />
                </button>
              }
            />
          )}
        </div>
      </FormSection>

      <div className={`flex gap-3 pt-2 ${props.onCancel ? 'justify-end flex-wrap' : 'justify-end'}`}>
        {props.onCancel ? (
          <Button type="button" variant="secondary" onClick={props.onCancel} disabled={props.loading}>
            Cancelar
          </Button>
        ) : null}
        <Button type="submit" loading={props.loading}>
          {props.submitLabel ?? (isEdit ? 'Guardar cambios' : 'Crear usuario')}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
