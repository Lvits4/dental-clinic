import { useState, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { TOAST_NO_UPDATES } from '../../constants/userFeedback';
import { Button, PageHeader, Modal, ConfirmDialog, FormModalScrollShell } from '../../components/ui';
import { HttpError } from '../../helpers/http';
import PerformedProceduresTable from '../../components/performed-procedures/PerformedProceduresTable';
import PerformedProcedureForm from '../../components/performed-procedures/PerformedProcedureForm';
import PerformedProcedureFilters from '../../components/performed-procedures/PerformedProcedureFilters';
import { usePerformedProceduresList } from '../../querys/performed-procedures/queryPerformedProcedures';
import {
  useCreatePerformedProcedure,
  useUpdatePerformedProcedure,
  useDeletePerformedProcedure,
} from '../../querys/performed-procedures/mutationPerformedProcedures';
import { usePatientsList } from '../../querys/patients/queryPatients';
import { useDoctorsList } from '../../querys/doctors/queryDoctors';
import { useTreatmentsForSelect } from '../../querys/treatments/queryTreatments';
import type { PerformedProcedure, PerformedProcedureSortBy, PerformedProcedureSortOrder } from '../../types';

const FormSkeleton = () => (
  <div className="animate-pulse space-y-5">
    <div className="rounded-md bg-slate-100 dark:bg-slate-800 h-10 w-48" />
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 rounded-md bg-slate-100 dark:bg-slate-800" />
            <div className="h-10 rounded-md bg-slate-100 dark:bg-slate-800" />
          </div>
        ))}
      </div>
    </div>
    <div className="h-px bg-slate-100 dark:bg-slate-800" />
    <div className="flex justify-end">
      <div className="h-10 w-32 rounded-md bg-slate-100 dark:bg-slate-800" />
    </div>
  </div>
);

const CreateProcedureEmptyState = ({
  title,
  message,
  linkTo,
  linkLabel,
}: {
  title: string;
  message: string;
  linkTo: string;
  linkLabel: string;
}) => (
  <div className="text-center py-10">
    <div className="w-12 h-12 rounded-md bg-amber-50 dark:bg-amber-900/20 mx-auto mb-3 flex items-center justify-center">
      <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    </div>
    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{title}</p>
    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">{message}</p>
    <Link
      to={linkTo}
      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
    >
      {linkLabel}
    </Link>
  </div>
);

function formatDetailDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start gap-2">
    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-28 shrink-0 pt-0.5">{label}</span>
    <span className="text-slate-800 dark:text-slate-200 break-words">{value}</span>
  </div>
);

const PerformedProceduresListView = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<PerformedProcedureSortBy>('performedAt');
  const [sortOrder, setSortOrder] = useState<PerformedProcedureSortOrder>('desc');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createFormKey, setCreateFormKey] = useState(0);
  const [viewTarget, setViewTarget] = useState<PerformedProcedure | null>(null);
  const [editTarget, setEditTarget] = useState<PerformedProcedure | null>(null);
  const [procedureToDelete, setProcedureToDelete] = useState<PerformedProcedure | null>(null);
  const limit = 10;

  const { data, isPending, isError, error, refetch } = usePerformedProceduresList({
    page,
    limit,
    sortBy,
    sortOrder,
    search: search.trim() || undefined,
  });

  const createMutation = useCreatePerformedProcedure();
  const updateMutation = useUpdatePerformedProcedure();
  const deleteProcedure = useDeletePerformedProcedure();

  const { data: patientsData, isLoading: patientsLoading } = usePatientsList({ limit: 100 });
  const { data: doctorsData, isLoading: doctorsLoading } = useDoctorsList();
  const { data: treatmentsPage, isLoading: treatmentsLoading } = useTreatmentsForSelect();

  const allPatients = patientsData?.data ?? [];
  const activePatients = allPatients.filter((p) => p.isActive);
  const activeDoctors = (doctorsData ?? []).filter((d) => d.isActive);
  const createModalLoading = patientsLoading || doctorsLoading || treatmentsLoading;

  const patientsForProcedureForm = useMemo(() => {
    if (!editTarget) return activePatients;
    const ids = new Set(activePatients.map((p) => p.id));
    if (ids.has(editTarget.patientId)) return activePatients;
    const p = allPatients.find((x) => x.id === editTarget.patientId);
    return p ? [...activePatients, p] : activePatients;
  }, [activePatients, allPatients, editTarget]);

  const doctorsForProcedureForm = useMemo(() => {
    if (!editTarget) return activeDoctors;
    const ids = new Set(activeDoctors.map((d) => d.id));
    if (ids.has(editTarget.doctorId)) return activeDoctors;
    const d = (doctorsData ?? []).find((x) => x.id === editTarget.doctorId);
    return d ? [...activeDoctors, d] : activeDoctors;
  }, [activeDoctors, doctorsData, editTarget]);

  const listErrorMessage =
    error instanceof HttpError
      ? typeof error.details === 'string'
        ? error.details
        : Array.isArray(error.details)
          ? error.details.join(', ')
          : error.message
      : error instanceof Error
        ? error.message
        : 'No se pudo cargar la lista de procedimientos realizados.';

  const handleSort = (sortKey: string) => {
    const k = sortKey as PerformedProcedureSortBy;
    if (sortBy === k) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(k);
      setSortOrder(k === 'performedAt' ? 'desc' : 'asc');
    }
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const hasFilters = !!search.trim();

  const resetFilters = () => {
    setSearch('');
    setPage(1);
  };

  const openCreateModal = () => {
    setCreateFormKey((k) => k + 1);
    setCreateModalOpen(true);
  };

  const deleteTargetLabel = procedureToDelete?.patient
    ? `${procedureToDelete.patient.firstName} ${procedureToDelete.patient.lastName}`
    : 'este registro';

  useEffect(() => {
    if (isError || !data?.meta) return;
    const tp = Math.max(1, data.meta.totalPages);
    setPage((p) => Math.min(p, tp));
  }, [data?.meta.totalPages, isError]);

  return (
    <div className="flex flex-col gap-2 flex-1 min-h-0 sm:gap-3">
      <div className="shrink-0">
        <PageHeader
          dense
          titleTone="subtle"
          title="Procedimientos realizados"
          subtitle={
            data && !isError
              ? `${data.meta.totalItems} ${data.meta.totalItems === 1 ? 'registro' : 'registros'} ${hasFilters ? 'con el filtro actual' : 'en total'}`
              : !isError
                ? 'Historial de procedimientos clínicos'
                : undefined
          }
          breadcrumb={[
            { label: 'Inicio', to: '/' },
            { label: 'Procedimientos realizados' },
          ]}
        />
      </div>

      <div className="shrink-0">
        <PerformedProcedureFilters
          search={search}
          onSearchChange={handleSearchChange}
          hasFilters={hasFilters}
          onResetFilters={resetFilters}
          trailingActions={
            <Button
              type="button"
              className="h-10 min-h-10 shrink-0 !py-0 px-4 whitespace-nowrap rounded-md"
              onClick={openCreateModal}
            >
              <svg className="w-4 h-4 mr-1.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo procedimiento
            </Button>
          }
        />
      </div>

      <div className="flex-1 flex flex-col min-h-0 min-w-0">
        {isError ? (
          <div
            role="alert"
            className="flex flex-col items-center justify-center gap-4 rounded-md border border-red-200 bg-red-50/90 px-6 py-12 text-center dark:border-red-900/50 dark:bg-red-950/30"
          >
            <p className="text-sm text-red-800 dark:text-red-200 max-w-md">{listErrorMessage}</p>
            <Button type="button" onClick={() => refetch()}>
              Reintentar
            </Button>
          </div>
        ) : (
          <PerformedProceduresTable
            data={data?.data || []}
            loading={isPending && !data}
            fillHeight
            onViewProcedure={setViewTarget}
            onEditProcedure={setEditTarget}
            onDeleteProcedure={setProcedureToDelete}
            sortColumn={sortBy}
            sortDirection={sortOrder}
            onSort={handleSort}
            pagination={
              data && !isError && data.meta.totalItems > 0
                ? {
                    page,
                    totalPages: Math.max(1, data.meta.totalPages),
                    total: data.meta.totalItems,
                    limit: data.meta.limit,
                    onPageChange: setPage,
                  }
                : undefined
            }
          />
        )}
      </div>

      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Nuevo procedimiento"
        size="lg"
        containBodyHeight
        panelClassName="min-h-[min(26rem,90dvh)]"
      >
        {createModalLoading ? (
          <FormSkeleton />
        ) : activePatients.length === 0 ? (
          <CreateProcedureEmptyState
            title="No hay pacientes activos"
            message={
              allPatients.length > 0
                ? 'Todos los pacientes están desactivados. Active al menos uno para registrar un procedimiento.'
                : 'Debe crear al menos un paciente antes de registrar un procedimiento.'
            }
            linkTo="/patients"
            linkLabel={allPatients.length > 0 ? 'Ir a Pacientes' : 'Crear Paciente'}
          />
        ) : (
          <FormModalScrollShell>
            <PerformedProcedureForm
              key={createFormKey}
              patients={patientsForProcedureForm}
              doctors={doctorsForProcedureForm}
              treatments={treatmentsPage?.data ?? []}
              loading={createMutation.isPending}
              onSubmit={(payload) => {
                createMutation.mutate(payload, {
                  onSettled: () => setCreateModalOpen(false),
                });
              }}
              onCancel={() => setCreateModalOpen(false)}
            />
          </FormModalScrollShell>
        )}
      </Modal>

      <Modal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Editar procedimiento"
        size="lg"
        containBodyHeight
        panelClassName="min-h-[min(26rem,90dvh)]"
      >
        {editTarget &&
          (createModalLoading ? (
            <FormSkeleton />
          ) : (
            <FormModalScrollShell>
              <PerformedProcedureForm
                key={editTarget.id}
                mode="edit"
                initialProcedure={editTarget}
                patients={patientsForProcedureForm}
                doctors={doctorsForProcedureForm}
                treatments={treatmentsPage?.data ?? []}
                loading={updateMutation.isPending}
                onUnchanged={() => {
                  toast(TOAST_NO_UPDATES, { duration: 2800 });
                  setEditTarget(null);
                }}
                onSubmit={(payload) => {
                  const { treatmentPlanItemId: _t, ...data } = payload;
                  updateMutation.mutate(
                    { id: editTarget.id, data },
                    { onSettled: () => setEditTarget(null) },
                  );
                }}
                onCancel={() => setEditTarget(null)}
              />
            </FormModalScrollShell>
          ))}
      </Modal>

      <Modal isOpen={!!viewTarget} onClose={() => setViewTarget(null)} title="Detalle del procedimiento" size="md">
        {viewTarget && (
          <div className="space-y-4 text-sm">
            <DetailRow label="Fecha" value={formatDetailDate(viewTarget.performedAt)} />
            <DetailRow
              label="Paciente"
              value={
                viewTarget.patient
                  ? `${viewTarget.patient.firstName} ${viewTarget.patient.lastName}`
                  : '—'
              }
            />
            <DetailRow
              label="Doctor"
              value={
                viewTarget.doctor
                  ? `Dr. ${viewTarget.doctor.firstName} ${viewTarget.doctor.lastName}`
                  : '—'
              }
            />
            <DetailRow label="Tratamiento" value={viewTarget.treatment?.name || '—'} />
            <DetailRow label="Pieza" value={viewTarget.tooth || '—'} />
            <DetailRow label="Descripción" value={viewTarget.description || '—'} />
            <DetailRow label="Notas" value={viewTarget.notes || '—'} />
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setEditTarget(viewTarget);
                  setViewTarget(null);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white transition-all duration-150 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.75}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Editar procedimiento
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!procedureToDelete}
        onClose={() => setProcedureToDelete(null)}
        onConfirm={() => {
          if (procedureToDelete) {
            deleteProcedure.mutate(procedureToDelete.id, {
              onSettled: () => setProcedureToDelete(null),
            });
          }
        }}
        title="Eliminar procedimiento"
        message={`¿Eliminar el procedimiento del ${procedureToDelete ? formatDetailDate(procedureToDelete.performedAt) : ''} de ${deleteTargetLabel}? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        loading={deleteProcedure.isPending}
      />
    </div>
  );
};

export default PerformedProceduresListView;
