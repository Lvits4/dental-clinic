import { useState, useEffect, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { PageHeader, Input, Button, FormSection } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useUpdateAccount } from '../../querys/auth/mutationAuth';
import { Role } from '../../enums';
import type { UpdateAccountDto } from '../../types';

const ROLE_LABEL: Record<string, string> = {
  [Role.ADMIN]: 'Administrador',
  [Role.DOCTOR]: 'Doctor',
  [Role.RECEPTIONIST]: 'Recepción',
};

const IconAccount = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const IconLock = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const AccountView = () => {
  const { user } = useAuth();
  const mutation = useUpdateAccount();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!user) return;
    setFullName(user.fullName);
    setUsername(user.username);
    setEmail(user.email);
  }, [user]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const payload: UpdateAccountDto = {};

    if (fullName.trim() !== user.fullName) {
      payload.fullName = fullName.trim();
    }
    if (username.trim() !== user.username) {
      payload.username = username.trim();
    }
    if (email.trim() !== user.email) {
      payload.email = email.trim();
    }

    const wantsPasswordChange = newPassword.length > 0 || confirmPassword.length > 0;
    if (wantsPasswordChange) {
      if (newPassword.length < 6) {
        toast.error('La nueva contraseña debe tener al menos 6 caracteres');
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error('La confirmación no coincide con la nueva contraseña');
        return;
      }
      if (!currentPassword) {
        toast.error('Indica tu contraseña actual para cambiarla');
        return;
      }
      payload.newPassword = newPassword;
      payload.currentPassword = currentPassword;
    }

    if (Object.keys(payload).length === 0) {
      toast.error('No hay cambios que guardar');
      return;
    }

    mutation.mutate(payload, {
      onSuccess: () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      },
    });
  };

  if (!user) {
    return null;
  }

  const sectionShell =
    'min-w-0 h-full min-h-0 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 sm:p-4 flex flex-col';
  const sectionFieldsetClear =
    '!border-0 !bg-transparent !p-0 !shadow-none ring-0 focus-within:ring-0 flex h-full min-h-0 flex-col flex-1';
  /** Campos más estrechos; el bloque no ocupa todo el ancho de la columna */
  const fieldsCol = 'w-full max-w-[min(100%,17.5rem)] sm:max-w-xs';
  /** Misma altura de descripción en ambas columnas → inputs alineados en horizontal */
  const sectionDescAlign = 'min-h-[2.75rem] sm:min-h-10 text-balance';

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-3">
      <PageHeader
        title="Mi cuenta"
        subtitle="Datos de acceso y seguridad"
        breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'Mi cuenta' }]}
        dense
      />

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 items-stretch">
          <div className={sectionShell}>
            <FormSection
              title="Perfil"
              icon={<IconAccount />}
              description={`Nombre, usuario y correo. Rol: ${ROLE_LABEL[user.role] ?? user.role}.`}
              descriptionClassName={sectionDescAlign}
              dense
              className={sectionFieldsetClear}
            >
              <div className={`grid grid-cols-1 gap-2.5 ${fieldsCol}`}>
                <Input label="Nombre completo" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                <Input label="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} required />
                <Input
                  label="Correo electrónico"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </FormSection>
          </div>

          <div className={sectionShell}>
            <FormSection
              title="Seguridad"
              icon={<IconLock />}
              description="Vacío = sin cambiar contraseña."
              descriptionClassName={sectionDescAlign}
              dense
              className={sectionFieldsetClear}
            >
              <div className={`grid grid-cols-1 gap-2.5 ${fieldsCol}`}>
                <Input
                  label="Contraseña actual"
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <Input
                  label="Nueva contraseña"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Input
                  label="Confirmar nueva contraseña"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </FormSection>
          </div>
        </div>

        <div className="flex justify-end border-t border-slate-200/80 dark:border-slate-700 pt-3 sm:grid sm:grid-cols-2 sm:gap-4">
          <div className="hidden min-h-0 sm:block" aria-hidden />
          <div className="flex w-full justify-end sm:w-auto">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Guardando…' : 'Guardar cambios'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AccountView;
