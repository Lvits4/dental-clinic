import { Link, useNavigate } from 'react-router-dom';
import { PageHeader, Button, Table, Badge } from '../../components/ui';
import type { Column } from '../../components/ui';
import { useTreatmentPlansList } from '../../querys/treatment-plans/queryTreatmentPlans';
import type { TreatmentPlan } from '../../types';
import { PLAN_STATUS_CONFIG } from '../../types';
import { TreatmentPlanStatus } from '../../enums';

const TreatmentPlansListView = () => {
  const { data, isLoading } = useTreatmentPlansList();
  const navigate = useNavigate();

  const columns: Column<TreatmentPlan>[] = [
    {
      key: 'patient',
      header: 'Paciente',
      render: (p) => p.patient
        ? <span className="font-medium text-slate-900 dark:text-white">{p.patient.firstName} {p.patient.lastName}</span>
        : '—',
    },
    {
      key: 'doctor',
      header: 'Doctor',
      render: (p) => p.doctor ? `Dr. ${p.doctor.firstName} ${p.doctor.lastName}` : '—',
      hideOnMobile: true,
    },
    {
      key: 'status',
      header: 'Estado',
      render: (p) => {
        const config = PLAN_STATUS_CONFIG[p.status as TreatmentPlanStatus];
        return config ? <Badge className={config.className}>{config.label}</Badge> : null;
      },
    },
    {
      key: 'items',
      header: 'Procedimientos',
      render: (p) => `${p.items?.length || 0}`,
      hideOnMobile: true,
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Planes de Tratamiento"
        breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'Planes de Tratamiento' }]}
        action={
          <Link to="/treatment-plans/new">
            <Button>
              <svg className="w-5 h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Plan
            </Button>
          </Link>
        }
      />

      <Table<TreatmentPlan>
        columns={columns}
        data={data || []}
        keyExtractor={(p) => p.id}
        onRowClick={(p) => navigate(`/treatment-plans/${p.id}`)}
        loading={isLoading}
        emptyMessage="No hay planes de tratamiento"
      />
    </div>
  );
};

export default TreatmentPlansListView;
