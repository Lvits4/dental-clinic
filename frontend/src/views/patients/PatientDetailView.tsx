import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Button, Card, PageHeader, Spinner, ConfirmDialog,
  Pagination, DatePicker,
} from '../../components/ui';
import {
  DETAIL_INFO_GRID_CLASS,
  DETAIL_INFO_SECTION_TITLE_CLASS,
  DETAIL_INFO_TILE_CLASS,
} from '../../components/ui/detailInfoLayout';
import AppointmentStatusBadge from '../../components/appointments/AppointmentStatusBadge';
import AppointmentFormModal from '../../components/appointments/AppointmentFormModal';
import { Role } from '../../enums';
import ClinicalRecordFormModal from '../../components/clinical-records/ClinicalRecordFormModal';
import ClinicalEvolutionFormModal from '../../components/clinical-evolutions/ClinicalEvolutionFormModal';
import ClinicalEvolutionCard from '../../components/clinical-evolutions/ClinicalEvolutionCard';
import FileUploadZone from '../../components/clinical-files/FileUploadZone';
import ClinicalFileCard from '../../components/clinical-files/ClinicalFileCard';
import { usePatientDetail } from '../../querys/patients/queryPatients';
import PatientFormModal from '../../components/patients/PatientFormModal';
import { useAuth } from '../../context/AuthContext';
import type { PatientModalLocationState } from './PatientRouteRedirects';
import { useAppointmentsList } from '../../querys/appointments/queryAppointments';
import { useClinicalRecord } from '../../querys/clinical-records/queryClinicalRecords';
import { useClinicalEvolutionsList } from '../../querys/clinical-evolutions/queryClinicalEvolutions';
import { useClinicalFilesList } from '../../querys/clinical-files/queryClinicalFiles';
import { useUploadClinicalFile, useDeleteClinicalFile } from '../../querys/clinical-files/mutationClinicalFiles';
import type { Patient, Appointment } from '../../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SEX_LABELS: Record<string, string> = {
  male: 'Masculino',
  female: 'Femenino',
  other: 'Otro',
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function calculateAge(dateStr: string): number {
  const birth = new Date(dateStr);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type TabKey = 'info' | 'record' | 'evolutions' | 'files' | 'appointments';

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'info', label: 'Datos', icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' },
  { key: 'record', label: 'Expediente', icon: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z' },
  { key: 'evolutions', label: 'Evoluciones', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
  { key: 'files', label: 'Archivos', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
  { key: 'appointments', label: 'Citas', icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5' },
];

const RECORD_SECTIONS = [
  { key: 'medicalBackground' as const, label: 'Antecedentes Medicos' },
  { key: 'dentalBackground' as const, label: 'Antecedentes Odontologicos' },
  { key: 'consultationReason' as const, label: 'Motivo de Consulta' },
  { key: 'diagnosis' as const, label: 'Diagnostico' },
  { key: 'observations' as const, label: 'Observaciones', fullWidth: true },
];

// ─── Tab: Info ────────────────────────────────────────────────────────────────

const PatientInfoTab = ({ patient }: { patient: Patient }) => {
  const items: { label: string; value: string; fullWidth?: boolean; breakWords?: boolean }[] = [
    { label: 'Sexo', value: SEX_LABELS[patient.sex] || patient.sex },
    {
      label: 'Fecha de nacimiento',
      value: `${formatDate(patient.dateOfBirth)} (${calculateAge(patient.dateOfBirth)} anos)`,
    },
    { label: 'Telefono', value: patient.phone },
    { label: 'Correo', value: patient.email || '—', breakWords: true },
    { label: 'Direccion', value: patient.address || '—', fullWidth: true, breakWords: true },
  ];

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <section className="flex flex-1 flex-col min-h-0 rounded-md border border-slate-200/80 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/30 p-4 sm:p-5">
        <h3 className={DETAIL_INFO_SECTION_TITLE_CLASS}>Información general</h3>
        <div className={DETAIL_INFO_GRID_CLASS}>
          {items.map((item) => (
            <div
              key={item.label}
              className={[DETAIL_INFO_TILE_CLASS, item.fullWidth ? 'sm:col-span-2' : ''].filter(Boolean).join(' ')}
            >
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{item.label}</p>
              <p
                className={[
                  'text-sm font-medium text-slate-900 dark:text-white',
                  item.breakWords ? 'break-words' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// ─── Tab: Expediente ──────────────────────────────────────────────────────────

const RecordTab = ({ patientId }: { patientId: string }) => {
  const { data: record, isLoading, error } = useClinicalRecord(patientId);
  const [recordModal, setRecordModal] = useState<null | 'create' | 'edit'>(null);
  const noRecord = !!error && !record;

  if (isLoading) return <div className="flex justify-center py-8"><Spinner /></div>;

  if (noRecord) {
    return (
      <>
        <div className="text-center py-8">
          <svg className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
          </svg>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Este paciente no tiene expediente clinico aun.</p>
          <Button type="button" onClick={() => setRecordModal('create')} size="sm">
            Crear Expediente
          </Button>
        </div>
        <ClinicalRecordFormModal
          patientId={patientId}
          isOpen={recordModal === 'create'}
          onClose={() => setRecordModal(null)}
          mode="create"
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white min-w-0">
            Expediente clínico
          </h3>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="shrink-0"
            onClick={() => setRecordModal('edit')}
          >
            Editar
          </Button>
        </div>
        <div className={DETAIL_INFO_GRID_CLASS}>
          {RECORD_SECTIONS.map((s) => {
            const text = record?.[s.key] || '—';
            const fullWidth = 'fullWidth' in s && s.fullWidth;
            return (
              <div
                key={s.key}
                className={[DETAIL_INFO_TILE_CLASS, fullWidth ? 'sm:col-span-2' : ''].filter(Boolean).join(' ')}
              >
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{s.label}</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white whitespace-pre-line break-words">
                  {text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <ClinicalRecordFormModal
        patientId={patientId}
        isOpen={recordModal === 'edit'}
        onClose={() => setRecordModal(null)}
        mode="edit"
        record={record}
      />
    </>
  );
};

// ─── Tab: Evoluciones ─────────────────────────────────────────────────────────

const EvolutionsTab = ({ patientId }: { patientId: string }) => {
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [evolutionModalOpen, setEvolutionModalOpen] = useState(false);
  const { data: record, isLoading: loadingRecord } = useClinicalRecord(patientId);
  const { data, isLoading } = useClinicalEvolutionsList({
    page,
    limit: 5,
    recordId: record?.id,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  useEffect(() => {
    if (!data?.meta) return;
    const tp = Math.max(1, data.meta.totalPages);
    setPage((p) => Math.min(p, tp));
  }, [data?.meta.totalPages]);

  const hasDateFilters = !!(dateFrom || dateTo);

  const resetDateFilters = () => {
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  if (loadingRecord || isLoading) return <div className="flex justify-center py-8"><Spinner /></div>;

  if (!record) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Debe crear el expediente clinico primero para registrar evoluciones.
        </p>
      </div>
    );
  }

  if (!data?.data?.length) {
    return (
      <>
        <div className="space-y-4">
          <div className="rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/40 p-3">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Filtrar por fecha</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <DatePicker
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPage(1);
                }}
                placeholder="Desde"
              />
              <DatePicker
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setPage(1);
                }}
                placeholder="Hasta"
                {...(dateFrom ? { min: dateFrom } : {})}
              />
            </div>
            {hasDateFilters && (
              <button
                type="button"
                onClick={resetDateFilters}
                className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Limpiar fechas
              </button>
            )}
          </div>
          <div className="text-center py-6">
            <svg className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              {hasDateFilters
                ? 'No hay evoluciones en este rango de fechas.'
                : 'No hay evoluciones registradas.'}
            </p>
            {hasDateFilters ? (
              <button
                type="button"
                onClick={resetDateFilters}
                className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Quitar filtro de fechas
              </button>
            ) : (
              <Button type="button" size="sm" onClick={() => setEvolutionModalOpen(true)}>
                Nueva Evolucion
              </Button>
            )}
          </div>
        </div>
        <ClinicalEvolutionFormModal
          patientId={patientId}
          isOpen={evolutionModalOpen}
          onClose={() => setEvolutionModalOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/40 p-3 flex-1 min-w-0 max-w-xl">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Filtrar por fecha</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <DatePicker
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPage(1);
                }}
                placeholder="Desde"
              />
              <DatePicker
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setPage(1);
                }}
                placeholder="Hasta"
                {...(dateFrom ? { min: dateFrom } : {})}
              />
            </div>
            {hasDateFilters && (
              <button
                type="button"
                onClick={resetDateFilters}
                className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Limpiar fechas
              </button>
            )}
          </div>
          <Button type="button" size="sm" className="shrink-0 self-end sm:self-auto" onClick={() => setEvolutionModalOpen(true)}>
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Nueva Evolucion
          </Button>
        </div>

        <div className="relative space-y-3 pl-5">
          <div className="absolute left-1 top-0 bottom-0 w-0.5 bg-emerald-200 dark:bg-emerald-800" />
          {data.data.map((evolution) => (
            <div key={evolution.id} className="relative">
              <div className="absolute -left-4 top-5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
              <ClinicalEvolutionCard evolution={evolution} />
            </div>
          ))}
        </div>

        {data.meta.totalItems > 0 && (
          <Pagination
            compact
            page={page}
            totalPages={Math.max(1, data.meta.totalPages)}
            total={data.meta.totalItems}
            limit={data.meta.limit}
            onPageChange={setPage}
          />
        )}
      </div>
      <ClinicalEvolutionFormModal
        patientId={patientId}
        isOpen={evolutionModalOpen}
        onClose={() => setEvolutionModalOpen(false)}
      />
    </>
  );
};

// ─── Tab: Archivos ────────────────────────────────────────────────────────────

const FilesTab = ({ patientId }: { patientId: string }) => {
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading, isError } = useClinicalFilesList({ page, limit: 6, patientId });
  const uploadMutation = useUploadClinicalFile(patientId);
  const deleteMutation = useDeleteClinicalFile();

  const handleDelete = () => {
    if (deleteId) deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  useEffect(() => {
    if (isError || !data?.meta) return;
    const tp = Math.max(1, data.meta.totalPages);
    setPage((p) => Math.min(p, tp));
  }, [data?.meta.totalPages, isError]);

  if (isLoading) return <div className="flex justify-center py-8"><Spinner /></div>;

  return (
    <div className="space-y-4">
      <FileUploadZone onUpload={(file) => uploadMutation.mutate({ file })} loading={uploadMutation.isPending} />

      {!data?.data?.length ? (
        <div className="text-center py-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">No hay archivos clinicos.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.data.map((file) => (
              <ClinicalFileCard
                key={file.id}
                file={file}
                onDelete={(id) => setDeleteId(id)}
                deleteLoading={deleteMutation.isPending && deleteId === file.id}
              />
            ))}
          </div>
          {data.meta.totalItems > 0 && (
            <Pagination
              compact
              page={page}
              totalPages={Math.max(1, data.meta.totalPages)}
              total={data.meta.totalItems}
              limit={data.meta.limit}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Eliminar archivo"
        message="¿Estas seguro de eliminar este archivo? Esta accion no se puede deshacer."
        confirmLabel="Eliminar"
        loading={deleteMutation.isPending}
      />
    </div>
  );
};

// ─── Tab: Citas ───────────────────────────────────────────────────────────────

const AppointmentsTab = ({ patientId }: { patientId: string }) => {
  const [page, setPage] = useState(1);
  const [editTarget, setEditTarget] = useState<Appointment | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading, isError } = useAppointmentsList({ page, limit: 8, patientId });

  useEffect(() => {
    if (isError || !data?.meta) return;
    const tp = Math.max(1, data.meta.totalPages);
    setPage((p) => Math.min(p, tp));
  }, [data?.meta.totalPages, isError]);

  if (isLoading) return <div className="flex justify-center py-8"><Spinner /></div>;

  if (!data?.data?.length) {
    return (
      <>
        <div className="text-center py-8">
          <svg className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">No hay citas registradas para este paciente.</p>
          <Button type="button" size="sm" onClick={() => setCreateOpen(true)}>
            Agendar cita
          </Button>
        </div>
        <AppointmentFormModal
          mode="create"
          isOpen={createOpen}
          onClose={() => setCreateOpen(false)}
          defaultPatientId={patientId}
        />
      </>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button type="button" size="sm" onClick={() => setCreateOpen(true)}>
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agendar cita
          </Button>
        </div>

        <div className="space-y-2">
          {data.data.map((apt) => (
            <button
              key={apt.id}
              type="button"
              onClick={() => setEditTarget(apt)}
              className="w-full text-left bg-slate-50 dark:bg-slate-800/50 rounded-md border border-slate-200/80 dark:border-slate-700/50 p-4 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {formatDateTime(apt.dateTime)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {apt.doctor ? `Dr. ${apt.doctor.firstName} ${apt.doctor.lastName}` : '—'}
                    {apt.reason ? ` · ${apt.reason}` : ''}
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <AppointmentStatusBadge status={apt.status} />
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        {data.meta.totalItems > 0 && (
          <Pagination
            compact
            page={page}
            totalPages={Math.max(1, data.meta.totalPages)}
            total={data.meta.totalItems}
            limit={data.meta.limit}
            onPageChange={setPage}
          />
        )}
      </div>

      <AppointmentFormModal
        mode="create"
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        defaultPatientId={patientId}
      />

      <AppointmentFormModal
        mode="edit"
        isOpen={!!editTarget}
        appointment={editTarget ?? undefined}
        onClose={() => setEditTarget(null)}
      />
    </>
  );
};

// ─── Vista principal ──────────────────────────────────────────────────────────

const PatientDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const canEditPatient =
    user?.role === Role.ADMIN || user?.role === Role.RECEPTIONIST;
  const { data: patient, isLoading } = usePatientDetail(id!);
  const [activeTab, setActiveTab] = useState<TabKey>('info');
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    const st = location.state as PatientModalLocationState | null;
    if (st?.openPatientModal !== 'edit') return;
    navigate(location.pathname, { replace: true, state: {} });
    if (canEditPatient) {
      setEditModalOpen(true);
    }
  }, [location.state, location.pathname, navigate, canEditPatient]);

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

  return (
    <div className="flex flex-col gap-2 flex-1 min-h-0">
      <div className="shrink-0">
        <PageHeader
          dense
          hideTitle
          breadcrumb={[
            { label: 'Pacientes', to: '/patients' },
            { label: `${patient.firstName} ${patient.lastName}` },
          ]}
        />
      </div>

      <Card padding="sm" rounding="compact" className="shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-md bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate">
              {patient.firstName} {patient.lastName}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {SEX_LABELS[patient.sex]} &middot; {calculateAge(patient.dateOfBirth)} anos
              {!patient.isActive && (
                <span className="text-amber-600 dark:text-amber-400"> &middot; Paciente inactivo</span>
              )}
            </p>
          </div>
          {canEditPatient && (
            <Button
              type="button"
              variant="secondary"
              className="shrink-0 rounded-md"
              onClick={() => setEditModalOpen(true)}
            >
              Editar
            </Button>
          )}
        </div>
      </Card>

      <div className="shrink-0 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-1 min-w-max sm:min-w-0">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={[
                'flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap',
                activeTab === tab.key
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
              ].join(' ')}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <Card
        padding="none"
        rounding="compact"
        className="flex flex-1 min-h-0 flex-col overflow-hidden"
        bodyClassName="flex flex-1 min-h-0 flex-col overflow-hidden"
      >
        <div className="flex flex-1 min-h-0 flex-col overflow-y-auto p-4 sm:p-5">
          {activeTab === 'info' && <PatientInfoTab patient={patient} />}
          {activeTab === 'record' && <RecordTab patientId={id!} />}
          {activeTab === 'evolutions' && <EvolutionsTab patientId={id!} />}
          {activeTab === 'files' && <FilesTab patientId={id!} />}
          {activeTab === 'appointments' && <AppointmentsTab patientId={id!} />}
        </div>
      </Card>

      {canEditPatient && id && (
        <PatientFormModal
          mode="edit"
          patientId={id}
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PatientDetailView;
