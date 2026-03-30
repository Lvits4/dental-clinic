import { Link, useNavigate } from 'react-router-dom';
import { PageHeader, Card } from '../../components/ui';
import PerformedProcedureForm from '../../components/performed-procedures/PerformedProcedureForm';
import { useCreatePerformedProcedure } from '../../querys/performed-procedures/mutationPerformedProcedures';
import { usePatientsList } from '../../querys/patients/queryPatients';
import { useDoctorsList } from '../../querys/doctors/queryDoctors';
import { useTreatmentsForSelect } from '../../querys/treatments/queryTreatments';

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

const EmptyState = ({ title, message, linkTo, linkLabel }: { title: string; message: string; linkTo: string; linkLabel: string }) => (
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

const PerformedProcedureCreateView = () => {
  const navigate = useNavigate();
  const createMutation = useCreatePerformedProcedure();
  const { data: patientsData, isLoading: lp } = usePatientsList({ limit: 100 });
  const { data: doctors, isLoading: ld } = useDoctorsList();
  const { data: treatmentsPage, isLoading: lt } = useTreatmentsForSelect();

  const loading = lp || ld || lt;

  const allPatients = patientsData?.data || [];
  const activePatients = allPatients.filter((p) => p.isActive);
  const activeDoctors = (doctors || []).filter((d) => d.isActive);

  return (
    <div className="flex flex-col gap-3 flex-1 min-h-0 sm:gap-4">
      <PageHeader
        dense
        titleTone="subtle"
        title="Nuevo procedimiento"
        subtitle="Registro en el historial clínico"
        breadcrumb={[
          { label: 'Inicio', to: '/' },
          { label: 'Procedimientos realizados', to: '/performed-procedures' },
          { label: 'Nuevo' },
        ]}
      />

      <Card>
        {loading ? (
          <FormSkeleton />
        ) : activePatients.length === 0 ? (
          <EmptyState
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
          <PerformedProcedureForm
            patients={activePatients}
            doctors={activeDoctors}
            treatments={treatmentsPage?.data ?? []}
            loading={createMutation.isPending}
            onSubmit={(data) => createMutation.mutate(data)}
            onCancel={() => navigate(-1)}
          />
        )}
      </Card>
    </div>
  );
};

export default PerformedProcedureCreateView;
