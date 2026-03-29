import { Link } from 'react-router-dom';
import { PageHeader, Card } from '../../components/ui';
import TreatmentPlanForm from '../../components/treatment-plans/TreatmentPlanForm';
import { useCreateTreatmentPlan } from '../../querys/treatment-plans/mutationTreatmentPlans';
import { usePatientsList } from '../../querys/patients/queryPatients';
import { useDoctorsList } from '../../querys/doctors/queryDoctors';

const FormSkeleton = () => (
  <div className="animate-pulse space-y-5">
    <div className="rounded-xl bg-slate-100 dark:bg-slate-800 h-10 w-48" />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[1, 2].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 rounded bg-slate-100 dark:bg-slate-800" />
          <div className="h-10 rounded-xl bg-slate-100 dark:bg-slate-800" />
        </div>
      ))}
    </div>
    <div className="space-y-2">
      <div className="h-4 w-24 rounded bg-slate-100 dark:bg-slate-800" />
      <div className="h-20 rounded-xl bg-slate-100 dark:bg-slate-800" />
    </div>
    <div className="flex justify-end">
      <div className="h-10 w-32 rounded-xl bg-slate-100 dark:bg-slate-800" />
    </div>
  </div>
);

const EmptyState = ({ title, message, linkTo, linkLabel }: { title: string; message: string; linkTo: string; linkLabel: string }) => (
  <div className="text-center py-10">
    <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/20 mx-auto mb-3 flex items-center justify-center">
      <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    </div>
    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{title}</p>
    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">{message}</p>
    <Link
      to={linkTo}
      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
    >
      {linkLabel}
    </Link>
  </div>
);

const TreatmentPlanCreateView = () => {
  const createMutation = useCreateTreatmentPlan();
  const { data: patientsData, isLoading: lp } = usePatientsList({ limit: 500 });
  const { data: doctors, isLoading: ld } = useDoctorsList();

  const loading = lp || ld;

  const allPatients = patientsData?.data || [];
  const activePatients = allPatients.filter((p) => p.isActive);
  const activeDoctors = (doctors || []).filter((d) => d.isActive);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Nuevo Plan de Tratamiento"
        breadcrumb={[
          { label: 'Inicio', to: '/' },
          { label: 'Planes de Tratamiento', to: '/treatment-plans' },
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
                ? 'Todos los pacientes están desactivados. Active al menos uno para crear un plan.'
                : 'Debe crear al menos un paciente antes de crear un plan de tratamiento.'
            }
            linkTo="/patients"
            linkLabel={allPatients.length > 0 ? 'Ir a Pacientes' : 'Crear Paciente'}
          />
        ) : (
          <TreatmentPlanForm
            patients={activePatients}
            doctors={activeDoctors}
            onSubmit={(data) => createMutation.mutate(data)}
            loading={createMutation.isPending}
            submitLabel="Crear Plan"
          />
        )}
      </Card>
    </div>
  );
};

export default TreatmentPlanCreateView;
