import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Button, Badge, Card, PageHeader, Spinner, ConfirmDialog,
  ToggleSwitch, Pagination, Modal,
} from '../../components/ui';
import AppointmentStatusBadge from '../../components/appointments/AppointmentStatusBadge';
import AppointmentForm from '../../components/appointments/AppointmentForm';
import { useUpdateStatus, useUpdateAppointment } from '../../querys/appointments/mutationAppointments';
import { usePatientsList } from '../../querys/patients/queryPatients';
import { useDoctorsList } from '../../querys/doctors/queryDoctors';
import { AppointmentStatus } from '../../enums';
import { STATUS_CONFIG } from '../../types';
import ClinicalRecordForm from '../../components/clinical-records/ClinicalRecordForm';
import ClinicalEvolutionCard from '../../components/clinical-evolutions/ClinicalEvolutionCard';
import FileUploadZone from '../../components/clinical-files/FileUploadZone';
import ClinicalFileCard from '../../components/clinical-files/ClinicalFileCard';
import { usePatientDetail } from '../../querys/patients/queryPatients';
import { useTogglePatientStatus } from '../../querys/patients/mutationPatients';
import { useAppointmentsList } from '../../querys/appointments/queryAppointments';
import { useClinicalRecord } from '../../querys/clinical-records/queryClinicalRecords';
import { useCreateClinicalRecord, useUpdateClinicalRecord } from '../../querys/clinical-records/mutationClinicalRecords';
import { useClinicalEvolutionsList } from '../../querys/clinical-evolutions/queryClinicalEvolutions';
import { useClinicalFilesList } from '../../querys/clinical-files/queryClinicalFiles';
import { useUploadClinicalFile, useDeleteClinicalFile } from '../../querys/clinical-files/mutationClinicalFiles';
import type { Patient, UpdateClinicalRecordDto, Appointment } from '../../types';

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
  { key: 'observations' as const, label: 'Observaciones' },
];

// ─── Tab: Info ────────────────────────────────────────────────────────────────

const PatientInfoTab = ({ patient }: { patient: Patient }) => {
  const rows = [
    { label: 'Sexo', value: SEX_LABELS[patient.sex] || patient.sex },
    { label: 'Fecha de nacimiento', value: `${formatDate(patient.dateOfBirth)} (${calculateAge(patient.dateOfBirth)} anos)` },
    { label: 'Telefono', value: patient.phone },
    { label: 'Correo', value: patient.email || '—' },
    { label: 'Direccion', value: patient.address || '—' },
  ];

  return (
    <div className="space-y-5">
      <dl className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col sm:flex-row sm:gap-2">
            <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:w-40 shrink-0">{row.label}</dt>
            <dd className="text-sm text-slate-900 dark:text-white">{row.value}</dd>
          </div>
        ))}
      </dl>

      {(patient.medicalHistory || patient.allergies || patient.medications || patient.observations) && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-4">
          {[
            { key: 'medicalHistory', label: 'Antecedentes Medicos' },
            { key: 'allergies', label: 'Alergias' },
            { key: 'medications', label: 'Medicamentos' },
            { key: 'observations', label: 'Observaciones' },
          ].map(({ key, label }) => {
            const value = (patient as Record<string, unknown>)[key] as string | undefined;
            return value ? (
              <div key={key}>
                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{label}</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">{value}</p>
              </div>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
};

// ─── Tab: Expediente ──────────────────────────────────────────────────────────

const RecordTab = ({ patientId }: { patientId: string }) => {
  const { data: record, isLoading, error } = useClinicalRecord(patientId);
  const createMutation = useCreateClinicalRecord();
  const updateMutation = useUpdateClinicalRecord(record?.id || '', patientId);
  const [editing, setEditing] = useState(false);
  const noRecord = !!error && !record;

  const handleSubmit = (data: UpdateClinicalRecordDto) => {
    if (record) {
      updateMutation.mutate(data, { onSuccess: () => setEditing(false) });
    } else {
      createMutation.mutate({ patientId, ...data }, { onSuccess: () => setEditing(false) });
    }
  };

  if (isLoading) return <div className="flex justify-center py-8"><Spinner /></div>;

  if (noRecord && !editing) {
    return (
      <div className="text-center py-8">
        <svg className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
        </svg>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Este paciente no tiene expediente clinico aun.</p>
        <Button onClick={() => setEditing(true)} size="sm">Crear Expediente</Button>
      </div>
    );
  }

  if (editing) {
    return (
      <ClinicalRecordForm
        initialData={record}
        loading={createMutation.isPending || updateMutation.isPending}
        submitLabel={record ? 'Guardar' : 'Crear Expediente'}
        onSubmit={handleSubmit}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>Editar</Button>
      </div>
      {RECORD_SECTIONS.map((s) => (
        <div key={s.key}>
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">{s.label}</h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">{record?.[s.key] || '—'}</p>
        </div>
      ))}
    </div>
  );
};

// ─── Tab: Evoluciones ─────────────────────────────────────────────────────────

const EvolutionsTab = ({ patientId }: { patientId: string }) => {
  const [page, setPage] = useState(1);
  const { data: record, isLoading: loadingRecord } = useClinicalRecord(patientId);
  const { data, isLoading } = useClinicalEvolutionsList({ page, limit: 5, recordId: record?.id });

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
      <div className="text-center py-8">
        <svg className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">No hay evoluciones registradas.</p>
        <Link to={`/patients/${patientId}/evolutions/new`}>
          <Button size="sm">Nueva Evolucion</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link to={`/patients/${patientId}/evolutions/new`}>
          <Button size="sm">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            Nueva Evolucion
          </Button>
        </Link>
      </div>

      {/* Timeline */}
      <div className="relative space-y-3 pl-5">
        <div className="absolute left-1 top-0 bottom-0 w-0.5 bg-emerald-200 dark:bg-emerald-800" />
        {data.data.map((evolution) => (
          <div key={evolution.id} className="relative">
            <div className="absolute -left-4 top-5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
            <ClinicalEvolutionCard evolution={evolution} />
          </div>
        ))}
      </div>

      {data.meta.totalPages > 1 && (
        <Pagination
          page={data.meta.page}
          totalPages={data.meta.totalPages}
          total={data.meta.totalItems}
          limit={data.meta.limit}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

// ─── Tab: Archivos ────────────────────────────────────────────────────────────

const FilesTab = ({ patientId }: { patientId: string }) => {
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data, isLoading } = useClinicalFilesList({ page, limit: 6, patientId });
  const uploadMutation = useUploadClinicalFile(patientId);
  const deleteMutation = useDeleteClinicalFile();

  const handleDelete = () => {
    if (deleteId) deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
  };

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
          {data.meta.totalPages > 1 && (
            <Pagination
              page={data.meta.page}
              totalPages={data.meta.totalPages}
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

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start gap-2">
    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-28 shrink-0 pt-0.5">{label}</span>
    <span className="text-sm text-slate-800 dark:text-slate-200 break-words">{value}</span>
  </div>
);

const STATUS_BUTTON_CLASSES: Record<AppointmentStatus, string> = {
  [AppointmentStatus.SCHEDULED]:   'border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20',
  [AppointmentStatus.CONFIRMED]:   'border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/20',
  [AppointmentStatus.IN_PROGRESS]: 'border-yellow-300 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-700 dark:text-yellow-400 dark:hover:bg-yellow-900/20',
  [AppointmentStatus.ATTENDED]:    'border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700/40',
  [AppointmentStatus.CANCELLED]:   'border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20',
  [AppointmentStatus.NO_SHOW]:     'border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-900/20',
};

const AppointmentsTab = ({ patientId }: { patientId: string }) => {
  const [page, setPage] = useState(1);
  const [viewTarget, setViewTarget] = useState<Appointment | null>(null);
  const [editTarget, setEditTarget] = useState<Appointment | null>(null);

  const updateStatus      = useUpdateStatus();
  const updateAppointment = useUpdateAppointment();
  const { data: patientsData } = usePatientsList({ limit: 100 });
  const { data: doctorsData }  = useDoctorsList();
  const activePatients = (patientsData?.data ?? []).filter((p) => p.isActive);
  const activeDoctors  = (doctorsData ?? []).filter((d) => d.isActive);

  const allStatusesExceptCurrent = editTarget
    ? Object.values(AppointmentStatus).filter((s) => s !== editTarget.status)
    : [];

  const { data, isLoading } = useAppointmentsList({ page, limit: 8, patientId });

  if (isLoading) return <div className="flex justify-center py-8"><Spinner /></div>;

  if (!data?.data?.length) {
    return (
      <div className="text-center py-8">
        <svg className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">No hay citas registradas para este paciente.</p>
        <Link to="/appointments/new">
          <Button size="sm">Agendar Cita</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end">
          <Link to="/appointments/new">
            <Button size="sm">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Agendar Cita
            </Button>
          </Link>
        </div>

        <div className="space-y-2">
          {data.data.map((apt) => (
            <button
              key={apt.id}
              onClick={() => setViewTarget(apt)}
              className="w-full text-left bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/50 p-4 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
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

        {data.meta.totalPages > 1 && (
          <Pagination
            page={data.meta.page}
            totalPages={data.meta.totalPages}
            total={data.meta.totalItems}
            limit={data.meta.limit}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Modal ver cita (solo lectura) */}
      <Modal
        isOpen={!!viewTarget}
        onClose={() => setViewTarget(null)}
        title="Detalle de cita"
        size="md"
      >
        {viewTarget && (
          <div className="space-y-4 text-sm">
            <DetailRow label="Fecha / Hora" value={formatDateTime(viewTarget.dateTime)} />
            <DetailRow
              label="Paciente"
              value={viewTarget.patient
                ? `${viewTarget.patient.firstName} ${viewTarget.patient.lastName}`
                : '—'}
            />
            <DetailRow
              label="Doctor"
              value={viewTarget.doctor
                ? `Dr. ${viewTarget.doctor.firstName} ${viewTarget.doctor.lastName}`
                : '—'}
            />
            <DetailRow label="Duración" value={`${viewTarget.durationMinutes} min`} />
            <DetailRow label="Motivo"   value={viewTarget.reason || '—'} />
            <DetailRow label="Notas"    value={viewTarget.notes  || '—'} />
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-28 shrink-0">Estado</span>
              <AppointmentStatusBadge status={viewTarget.status} />
            </div>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                type="button"
                onClick={() => { setEditTarget(viewTarget); setViewTarget(null); }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white transition-all duration-150 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar cita
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal editar cita */}
      <Modal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Editar cita"
        size="lg"
      >
        {editTarget && (
          <AppointmentForm
            patients={activePatients}
            doctors={activeDoctors}
            initialValues={{
              patientId:       editTarget.patientId,
              doctorId:        editTarget.doctorId,
              date:            editTarget.dateTime.slice(0, 10),
              time:            editTarget.dateTime.slice(11, 16),
              durationMinutes: editTarget.durationMinutes,
              reason:          editTarget.reason,
              notes:           editTarget.notes,
            }}
            onSubmit={(data) => {
              updateAppointment.mutate(
                { id: editTarget.id, data },
                { onSettled: () => setEditTarget(null) },
              );
            }}
            loading={updateAppointment.isPending}
            submitLabel="Guardar cambios"
            footerContent={
              <div className="border-t border-slate-200 dark:border-slate-700 pt-5 mt-5">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Estado actual
                  </p>
                  <AppointmentStatusBadge status={editTarget.status} />
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">Cambiar a:</p>
                <div className="flex flex-wrap gap-2">
                  {allStatusesExceptCurrent.map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={updateStatus.isPending}
                      onClick={() =>
                        updateStatus.mutate(
                          { id: editTarget.id, status },
                          { onSuccess: () => setEditTarget((prev) => prev ? { ...prev, status } : null) },
                        )
                      }
                      className={[
                        'px-3 py-1.5 rounded-xl border text-xs font-medium transition-all duration-150 disabled:opacity-50 cursor-pointer',
                        STATUS_BUTTON_CLASSES[status],
                      ].join(' ')}
                    >
                      {STATUS_CONFIG[status]?.label ?? status}
                    </button>
                  ))}
                </div>
              </div>
            }
          />
        )}
      </Modal>
    </>
  );
};

// ─── Vista principal ──────────────────────────────────────────────────────────

const PatientDetailView = () => {
  const { id } = useParams<{ id: string }>();
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
      onSuccess: () => setShowToggleDialog(false),
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
          <Link to={`/patients/${id}/edit`}>
            <Button variant="secondary">Editar</Button>
          </Link>
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

      {/* Tabs */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-1 min-w-max sm:min-w-0">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={[
                'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
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

      {/* Contenido de la tab activa */}
      <Card>
        {activeTab === 'info' && <PatientInfoTab patient={patient} />}
        {activeTab === 'record' && <RecordTab patientId={id!} />}
        {activeTab === 'evolutions' && <EvolutionsTab patientId={id!} />}
        {activeTab === 'files' && <FilesTab patientId={id!} />}
        {activeTab === 'appointments' && <AppointmentsTab patientId={id!} />}
      </Card>

      <ConfirmDialog
        isOpen={showToggleDialog}
        onClose={() => setShowToggleDialog(false)}
        onConfirm={handleToggleConfirm}
        title={pendingStatus ? 'Activar paciente' : 'Desactivar paciente'}
        message={
          pendingStatus
            ? `¿Deseas activar a ${patient.firstName} ${patient.lastName}? El paciente volvera a aparecer en las listas de seleccion.`
            : `¿Deseas desactivar a ${patient.firstName} ${patient.lastName}? El paciente no sera eliminado, solo se marcara como inactivo.`
        }
        confirmLabel={pendingStatus ? 'Activar' : 'Desactivar'}
        loading={toggleStatusMutation.isPending}
      />
    </div>
  );
};

export default PatientDetailView;
