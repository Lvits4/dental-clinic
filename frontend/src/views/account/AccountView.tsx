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

  return (
    <div className="space-y-4">
      <PageHeader
        title="Mi cuenta"
        subtitle="Datos de acceso y seguridad"
        breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'Mi cuenta' }]}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 p-5 space-y-6">
          <FormSection
            title="Perfil"
            icon={<IconAccount />}
            description="Nombre visible, usuario e email de la cuenta"
          >
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Rol en el sistema:{' '}
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {ROLE_LABEL[user.role] ?? user.role}
              </span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Nombre completo" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              <Input label="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} required />
              <div className="sm:col-span-2">
                <Input
                  label="Correo electrónico"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          </FormSection>

          <FormSection
            title="Seguridad"
            icon={<IconLock />}
            description="Deja en blanco si no quieres cambiar la contraseña"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              <Input
                label="Contraseña actual"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <div className="hidden sm:block" aria-hidden />
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

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Guardando…' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AccountView;
