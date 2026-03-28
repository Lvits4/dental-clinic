import { Link } from 'react-router-dom';
import { useTreatmentPlansList } from '../hooks/useTreatmentPlans';
import Table, { type Column } from '../../../shared/components/ui/Table';
import Badge from '../../../shared/components/ui/Badge';
import Button from '../../../shared/components/ui/Button';
import type { TreatmentPlan } from '../types/treatment-plan.types';
import { PLAN_STATUS_CONFIG } from '../types/treatment-plan.types';

export default function TreatmentPlansListView() {
  const { data, isLoading } = useTreatmentPlansList();

  const columns: Column<TreatmentPlan>[] = [
    {
      key: 'patient',
      header: 'Paciente',
      render: (p) => p.patient ? <span className="font-medium text-gray-900 dark:text-white">{p.patient.firstName} {p.patient.lastName}</span> : '—',
    },
    {
      key: 'doctor',
      header: 'Doctor',
      render: (p) => p.doctor ? `Dr. ${p.doctor.firstName} ${p.doctor.lastName}` : '—',
    },
    {
      key: 'status',
      header: 'Estado',
      render: (p) => {
        const config = PLAN_STATUS_CONFIG[p.status];
        return <Badge className={config.className}>{config.label}</Badge>;
      },
    },
    {
      key: 'items',
      header: 'Procedimientos',
      render: (p) => `${p.items?.length || 0}`,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Planes de Tratamiento</h1>
        <Link to="/treatment-plans/new">
          <Button>
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Plan
          </Button>
        </Link>
      </div>
      <Table<TreatmentPlan>
        columns={columns}
        data={data || []}
        keyExtractor={(p) => p.id}
        onRowClick={(p) => {/* navigate to detail */}}
        loading={isLoading}
        emptyMessage="No hay planes de tratamiento"
      />
    </div>
  );
}
