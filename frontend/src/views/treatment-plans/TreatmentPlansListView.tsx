import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { TOAST_NO_UPDATES } from '../../constants/userFeedback';
import { PageHeader, Button, Badge, Modal, ConfirmDialog, FormModalScrollShell } from '../../components/ui';
import { HttpError } from '../../helpers/http';
import { useTreatmentPlansList } from '../../querys/treatment-plans/queryTreatmentPlans';
import {
  useUpdateTreatmentPlanStatus,
  useUpdateTreatmentPlan,
  useCreateTreatmentPlan,
  useDeleteTreatmentPlan,
} from '../../querys/treatment-plans/mutationTreatmentPlans';
import { usePatientsList } from '../../querys/patients/queryPatients';
import { useDoctorsForSelect } from '../../querys/doctors/queryDoctors';
import TreatmentPlanForm from '../../components/treatment-plans/TreatmentPlanForm';
import TreatmentPlanFilters, { type PlanStatusFilter } from '../../components/treatment-plans/TreatmentPlanFilters';
import TreatmentPlansTable from '../../components/treatment-plans/TreatmentPlansTable';
import type { Doctor, PaginatedResponse, Patient, TreatmentPlan, TreatmentPlanSortBy, TreatmentPlanSortOrder } from '../../types';
import { PLAN_STATUS_CONFIG } from '../../types';
import { countPerformedProceduresOnPlan } from '../../utils/treatmentPlans';
import { TreatmentPlanStatus } from '../../enums';
import { totalPagesFromMeta } from '../../utils/pagination';
import { DEFAULT_LIST_PAGE_SIZE, LIST_PAGE_SIZE_MAX } from '../../constants/pagination';

const PLAN_STATUS_BUTTON_CLASSES: Record<string, string> = {
  [TreatmentPlanStatus.PENDING]: 'border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20',
  [TreatmentPlanStatus.IN_PROGRESS]: 'border-yellow-300 text-yellow-700 hover:bg-yellow-50 dark:border-yellow-700 dark:text-yellow-400 dark:hover:bg-yellow-900/20',
  [TreatmentPlanStatus.COMPLETED]: 'border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/20',
  [TreatmentPlanStatus.CANCELLED]: 'border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20',
};

const FormSkeleton = () => (
  <div className="animate-pulse space-y-5">
    <div className="rounded-md bg-slate-100 dark:bg-slate-800 h-10 w-48" />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[1, 2].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 rounded-md bg-slate-100 dark:bg-slate-800" />
          <div className="h-10 rounded-md bg-slate-100 dark:bg-slate-800" />
        </div>
      ))}
    </div>
    <div className="space-y-2">
      <div className="h-4 w-24 rounded-md bg-slate-100 dark:bg-slate-800" />
      <div className="h-20 rounded-md bg-slate-100 dark:bg-slate-800" />
    </div>
    <div className="flex justify-end">
      <div className="h-10 w-32 rounded-md bg-slate-100 dark:bg-slate-800" />
    </div>
  </div>
);

const CreatePlanEmptyState = ({
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
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
    </div>
    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{title}</p>
    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">{message}</p>
    <Link
      to={linkTo}
      viewTransition
      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
    >
      {linkLabel}
    </Link>
  </div>
);

const TreatmentPlansListView = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PlanStatusFilter>('all');
  const [sortBy, setSortBy] = useState<TreatmentPlanSortBy>('patient');
  const [sortOrder, setSortOrder] = useState<TreatmentPlanSortOrder>('asc');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewTarget, setViewTarget] = useState<TreatmentPlan | null>(null);
  const [editTarget, setEditTarget] = useState<TreatmentPlan | null>(null);
  const [planToDelete, setPlanToDelete] = useState<TreatmentPlan | null>(null);
  const [limit, setLimit] = useState(DEFAULT_LIST_PAGE_SIZE);

  const { data, isPending, isError, error, refetch } = useTreatmentPlansList({
    page,
    limit,
    search: search.trim() || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    sortBy,
    sortOrder,
  });

  const createMutation = useCreateTreatmentPlan();
  const deletePlan = useDeleteTreatmentPlan();

  const updateStatus = useUpdateTreatmentPlanStatus(editTarget?.id ?? '');
  const updatePlan = useUpdateTreatmentPlan();

  const { data: patientsData, isLoading: patientsLoading } = usePatientsList({ limit: 100 });
  const { data: doctorsList, isLoading: doctorsLoading } = useDoctorsForSelect();
  const allPatients = patientsData?.data ?? [];
  const activePatients = allPatients.filter((p) => p.isActive);
  const patientsForPlanEdit = useMemo((): Patient[] => {
    if (!editTarget) return activePatients;
    const map = new Map<string, Patient>();
    for (const p of activePatients) map.set(p.id, p);
    const pid = editTarget.patientId;
    if (pid && !map.has(pid)) {
      const fromList = allPatients.find((x) => x.id === pid);
      if (fromList) map.set(fromList.id, fromList);
      else if (editTarget.patient) map.set(editTarget.patient.id, editTarget.patient);
    }
    return Array.from(map.values());
  }, [activePatients, allPatients, editTarget]);

  const doctorsForForm: Doctor[] = Array.isArray(doctorsList)
    ? doctorsList
    : doctorsList &&
        typeof doctorsList === 'object' &&
        'data' in doctorsList &&
        Array.isArray((doctorsList as PaginatedResponse<Doctor>).data)
      ? (doctorsList as PaginatedResponse<Doctor>).data
      : [];
  const activeDoctors = doctorsForForm.filter((d) => d.isActive);
  const doctorsForPlanEdit = useMemo((): Doctor[] => {
    if (!editTarget) return activeDoctors;
    const map = new Map<string, Doctor>();
    for (const d of activeDoctors) map.set(d.id, d);
    const did = editTarget.doctorId;
    if (did && !map.has(did)) {
      const fromList = doctorsForForm.find((x) => x.id === did);
      if (fromList) map.set(fromList.id, fromList);
      else if (editTarget.doctor) map.set(editTarget.doctor.id, editTarget.doctor);
    }
    return Array.from(map.values());
  }, [activeDoctors, doctorsForForm, editTarget]);

  const createModalLoading = patientsLoading || doctorsLoading;

  const allStatusesExceptCurrent = editTarget
    ? Object.values(TreatmentPlanStatus).filter((s) => s !== editTarget.status)
    : [];

  useEffect(() => {
    if (isError || !data?.meta) return;
    const tp = totalPagesFromMeta(data.meta, limit);
    setPage((pg) => Math.min(pg, tp));
  }, [data?.meta, isError, limit]);

  const listErrorMessage =
    error instanceof HttpError
      ? typeof error.details === 'string'
        ? error.details
        : Array.isArray(error.details)
          ? error.details.join(', ')
          : error.message
      : error instanceof Error
        ? error.message
        : 'No se pudo cargar la lista de planes de tratamiento.';

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusFilterChange = (value: PlanStatusFilter) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleSort = (sortKey: string) => {
    const k = sortKey as TreatmentPlanSortBy;
    if (sortBy === k) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(k);
      setSortOrder(k === 'createdAt' ? 'desc' : 'asc');
    }
    setPage(1);
  };

  const hasFilters = !!(search.trim() || statusFilter !== 'all');

  const resetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setPage(1);
  };

  const deleteTargetLabel = planToDelete?.patient
    ? `${planToDelete.patient.firstName} ${planToDelete.patient.lastName}`
    : 'este plan';

  return (
    <div className="flex flex-col gap-2 flex-1 min-h-0 sm:gap-3">
      <div className="shrink-0">
        <PageHeader
          dense
          titleTone="subtle"
          title="Planes de tratamiento"
          subtitle={
            data && !isError
              ? `${data.meta.totalItems} ${data.meta.totalItems === 1 ? 'plan' : 'planes'} ${hasFilters ? 'con el filtro actual' : 'en total'}`
              : !isError
                ? 'Planes clínicos por paciente'
                : undefined
          }
          breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'Planes de tratamiento' }]}
        />
      </div>

      <div className="shrink-0">
        <TreatmentPlanFilters
          search={search}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          hasFilters={hasFilters}
          onResetFilters={resetFilters}
          trailingActions={
            <Button
              type="button"
              className="h-10 min-h-10 shrink-0 py-0! px-4 whitespace-nowrap rounded-md"
              onClick={() => setCreateModalOpen(true)}
            >
              <svg className="w-4 h-4 mr-1.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo plan
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
          <TreatmentPlansTable
            data={data?.data || []}
            loading={isPending && !data}
            fillHeight
            onViewPlan={setViewTarget}
            onEditPlan={setEditTarget}
            onDeletePlan={setPlanToDelete}
            sortColumn={sortBy}
            sortDirection={sortOrder}
            onSort={handleSort}
            pagination={
              data && !isError
                ? {
                    page,
                    totalPages: totalPagesFromMeta(data.meta, limit),
                    total: data.meta.totalItems,
                    limit,
                    onPageChange: setPage,
                    onLimitChange: (n) => {
                      setLimit(n);
                      setPage(1);
                    },
                    minLimit: 1,
                    maxLimit: LIST_PAGE_SIZE_MAX,
                  }
                : undefined
            }
          />
        )}
      </div>

      <Modal isOpen={!!viewTarget} onClose={() => setViewTarget(null)} title="Detalle del plan" size="md">
        {viewTarget && (
          <div className="space-y-4 text-sm">
            <PlanDetailRow
              label="Paciente"
              value={
                viewTarget.patient
                  ? `${viewTarget.patient.firstName} ${viewTarget.patient.lastName}`
                  : '—'
              }
            />
            <PlanDetailRow
              label="Doctor"
              value={
                viewTarget.doctor
                  ? `Dr. ${viewTarget.doctor.firstName} ${viewTarget.doctor.lastName}`
                  : '—'
              }
            />
            <PlanDetailRow label="Observaciones" value={viewTarget.observations || '—'} />
            <PlanDetailRow
              label="Ítems del plan"
              value={`${viewTarget.items?.length || 0}`}
            />
            <PlanDetailRow
              label="Procedimientos realizados"
              value={`${countPerformedProceduresOnPlan(viewTarget)}`}
            />
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-28 shrink-0">Estado</span>
              {(() => {
                const cfg = PLAN_STATUS_CONFIG[viewTarget.status as TreatmentPlanStatus];
                return cfg ? <Badge className={cfg.className}>{cfg.label}</Badge> : null;
              })()}
            </div>

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
                Editar plan
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Nuevo plan de tratamiento"
        size="md"
        containBodyHeight
        panelClassName="min-h-[min(26rem,90dvh)]"
      >
        {createModalLoading ? (
          <FormSkeleton />
        ) : activePatients.length === 0 ? (
          <CreatePlanEmptyState
            title="No hay pacientes activos"
            message={
              allPatients.length > 0
                ? 'Todos los pacientes están desactivados. Active al menos uno para crear un plan.'
                : 'Debe crear al menos un paciente antes de crear un plan de tratamiento.'
            }
            linkTo="/patients"
            linkLabel={allPatients.length > 0 ? 'Ir a Pacientes' : 'Crear Paciente'}
          />
        ) : (
          <FormModalScrollShell>
            <TreatmentPlanForm
              key="treatment-plan-create"
              fillParent
              patients={activePatients}
              doctors={activeDoctors}
              onSubmit={(data) => {
                createMutation.mutate(data, {
                  onSettled: () => setCreateModalOpen(false),
                });
              }}
              loading={createMutation.isPending}
              submitLabel="Crear plan"
              onCancel={() => setCreateModalOpen(false)}
            />
          </FormModalScrollShell>
        )}
      </Modal>

      <Modal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        title="Editar plan de tratamiento"
        size="md"
        containBodyHeight
        panelClassName="min-h-[min(26rem,90dvh)]"
      >
        {editTarget && (
          <FormModalScrollShell>
            <TreatmentPlanForm
              key={editTarget.id}
              fillParent
              patients={patientsForPlanEdit}
              doctors={doctorsForPlanEdit}
              initialPatientId={editTarget.patientId}
              initialDoctorId={editTarget.doctorId}
              initialObservations={editTarget.observations}
              editObservationsOnly
              onUnchanged={() => {
                toast(TOAST_NO_UPDATES, { duration: 2800 });
                setEditTarget(null);
              }}
              onSubmit={(data) => {
                updatePlan.mutate(
                  { id: editTarget.id, data: { observations: data.observations } },
                  { onSettled: () => setEditTarget(null) },
                );
              }}
              loading={updatePlan.isPending}
              submitLabel="Guardar cambios"
              onCancel={() => setEditTarget(null)}
              footerContent={
              <div className="border-t border-slate-200 dark:border-slate-700 pt-5 mt-1">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Estado actual
                  </p>
                  {(() => {
                    const cfg = PLAN_STATUS_CONFIG[editTarget.status as TreatmentPlanStatus];
                    return cfg ? <Badge className={cfg.className}>{cfg.label}</Badge> : null;
                  })()}
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">Cambiar a:</p>
                <div className="flex flex-wrap gap-2">
                  {allStatusesExceptCurrent.map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={updateStatus.isPending}
                      onClick={() =>
                        updateStatus.mutate(status, {
                          onSuccess: () => {
                            setEditTarget((prev) => (prev ? { ...prev, status } : null));
                          },
                        })
                      }
                      className={[
                        'px-3 py-1.5 rounded-md border text-xs font-medium transition-all duration-150 disabled:opacity-50 cursor-pointer',
                        PLAN_STATUS_BUTTON_CLASSES[status] ?? 'border-slate-300 text-slate-700 hover:bg-slate-50',
                      ].join(' ')}
                    >
                      {PLAN_STATUS_CONFIG[status]?.label ?? status}
                    </button>
                  ))}
                </div>
              </div>
            }
            />
          </FormModalScrollShell>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!planToDelete}
        onClose={() => setPlanToDelete(null)}
        onConfirm={() => {
          if (planToDelete) {
            deletePlan.mutate(planToDelete.id, {
              onSettled: () => setPlanToDelete(null),
            });
          }
        }}
        title="Eliminar plan"
        message={`¿Eliminar el plan de ${deleteTargetLabel}? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        variant="danger"
        loading={deletePlan.isPending}
      />
    </div>
  );
};

const PlanDetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start gap-2">
    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-28 shrink-0 pt-0.5">{label}</span>
    <span className="text-slate-800 dark:text-slate-200 wrap-break-word">{value}</span>
  </div>
);

export default TreatmentPlansListView;
