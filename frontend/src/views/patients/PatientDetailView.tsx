import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button, Badge, Card, PageHeader, Spinner, ConfirmDialog, ToggleSwitch } from '../../components/ui';
import { usePatientDetail } from '../../querys/patients/queryPatients';
import { useTogglePatientStatus } from '../../querys/patients/mutationPatients';
import type { Patient } from '../../types';

const SEX_LABELS: Record<string, string> = {
  male: 'Masculino',
  female: 'Femenino',
  other: 'Otro',
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' });
}

function calculateAge(dateStr: string): number {
  const birth = new Date(dateStr);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

type TabKey = 'info' | 'record' | 'evolutions' | 'files' | 'appointments';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'info', label: 'Datos' },
  { key: 'record', label: 'Expediente' },
  { key: 'evolutions', label: 'Evoluciones' },
  { key: 'files', label: 'Archivos' },
  { key: 'appointments', label: 'Citas' },
];

interface PatientInfoTabProps {
  patient: Patient;
}

const PatientInfoTab = ({ patient }: PatientInfoTabProps) => {
  const rows = [
    { label: 'Sexo', value: SEX_LABELS[patient.sex] || patient.sex },
    {
      label: 'Fecha de nacimiento',
      value: `${formatDate(patient.dateOfBirth)} (${calculateAge(patient.dateOfBirth)} anos)`,
    },
    { label: 'Telefono', value: patient.phone },
    { label: 'Correo', value: patient.email || '—' },
    { label: 'Direccion', value: patient.address || '—' },
  ];

  return (
    <div className="space-y-5">
      <dl className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col sm:flex-row sm:gap-2">
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:w-40 shrink-0">
              {row.label}
            </dt>
            <dd className="text-sm text-slate-900 dark:text-white">{row.value}</dd>
          </div>
        ))}
      </dl>

      {(patient.medicalHistory || patient.allergies || patient.medications || patient.observations) && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-4">
          {patient.medicalHistory && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Antecedentes Medicos
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">
                {patient.medicalHistory}
              </p>
            </div>
          )}
          {patient.allergies && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Alergias
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">
                {patient.allergies}
              </p>
            </div>
          )}
          {patient.medications && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Medicamentos
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">
                {patient.medications}
              </p>
            </div>
          )}
          {patient.observations && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Observaciones
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">
                {patient.observations}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const PatientDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: patient, isLoading } = usePatientDetail(id!);
  const toggleStatusMutation = useTogglePatientStatus(id!);
  const [showToggleDialog, setShowToggleDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('info');

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400">Paciente no encontrado</p>
      </div>
    );
  }

  const handleToggleRequest = (newStatus: boolean) => {
    setPendingStatus(newStatus);
    setShowToggleDialog(true);
  };

  const handleToggleConfirm = () => {
    toggleStatusMutation.mutate(pendingStatus, {
      onSuccess: () => {
        setShowToggleDialog(false);
      },
    });
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title={`${patient.firstName} ${patient.lastName}`}
        subtitle={patient.isActive ? undefined : 'Paciente inactivo'}
        breadcrumb={[
          { label: 'Pacientes', to: '/patients' },
          { label: `${patient.firstName} ${patient.lastName}` },
        ]}
        action={
          <div className="flex items-center gap-3">
            <ToggleSwitch
              checked={patient.isActive}
              onChange={handleToggleRequest}
              label={patient.isActive ? 'Activo' : 'Inactivo'}
              size="sm"
              disabled={toggleStatusMutation.isPending}
            />
            <Link to={`/patients/${id}/edit`}>
              <Button variant="secondary" size="sm">Editar</Button>
            </Link>
          </div>
        }
      />

      {/* Cabecera del paciente */}
      <Card padding="sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
            </span>
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate">
              {patient.firstName} {patient.lastName}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {SEX_LABELS[patient.sex]} &middot; {calculateAge(patient.dateOfBirth)} anos
            </p>
          </div>
          <Badge
            className={`ml-auto shrink-0 ${
              patient.isActive
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {patient.isActive ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>
      </Card>

      {/* Tabs - pills scrollables horizontalmente en mobile */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-1 min-w-max sm:min-w-0">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={[
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                activeTab === tab.key
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
              ].join(' ')}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido de la tab activa */}
      <Card>
        {activeTab === 'info' && <PatientInfoTab patient={patient} />}

        {activeTab === 'record' && (
          <div className="text-center py-6">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              Ver expediente clinico del paciente
            </p>
            <Link to={`/patients/${id}/clinical-record`}>
              <Button variant="secondary">Ir al Expediente</Button>
            </Link>
          </div>
        )}

        {activeTab === 'evolutions' && (
          <div className="text-center py-6">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              Ver evoluciones clinicas del paciente
            </p>
            <Link to={`/patients/${id}/evolutions`}>
              <Button variant="secondary">Ver Evoluciones</Button>
            </Link>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="text-center py-6">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              Archivos clinicos del paciente
            </p>
            <Link to={`/patients/${id}/files`}>
              <Button variant="secondary">Ver Archivos</Button>
            </Link>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="text-center py-6">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              Historial de citas del paciente
            </p>
            <Link to={`/appointments?patient=${id}`}>
              <Button variant="secondary">Ver Citas</Button>
            </Link>
          </div>
        )}
      </Card>

      <ConfirmDialog
        isOpen={showToggleDialog}
        onClose={() => setShowToggleDialog(false)}
        onConfirm={handleToggleConfirm}
        title={pendingStatus ? 'Activar paciente' : 'Desactivar paciente'}
        message={
          pendingStatus
            ? `¿Deseas activar a ${patient.firstName} ${patient.lastName}? El paciente volverá a aparecer en las listas de selección.`
            : `¿Deseas desactivar a ${patient.firstName} ${patient.lastName}? El paciente no será eliminado, solo se marcará como inactivo.`
        }
        confirmLabel={pendingStatus ? 'Activar' : 'Desactivar'}
        loading={toggleStatusMutation.isPending}
      />
    </div>
  );
};

export default PatientDetailView;
