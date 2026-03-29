import { Link } from 'react-router-dom';
import { PageHeader, Button } from '../../components/ui';
import TreatmentsTable from '../../components/treatments/TreatmentsTable';
import { useTreatmentsList } from '../../querys/treatments/queryTreatments';
import { useToggleTreatment } from '../../querys/treatments/mutationTreatments';

const TreatmentsListView = () => {
  const { data, isLoading } = useTreatmentsList();
  const toggleMutation = useToggleTreatment();

  return (
    <div className="space-y-4">
      <PageHeader
        title="Catálogo de Tratamientos"
        breadcrumb={[{ label: 'Inicio', to: '/' }, { label: 'Tratamientos' }]}
        action={
          <Link to="/treatments/new">
            <Button>
              <svg className="w-5 h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Tratamiento
            </Button>
          </Link>
        }
      />

      <TreatmentsTable
        data={data || []}
        loading={isLoading}
        onToggle={(id) => toggleMutation.mutate(id)}
        togglePending={toggleMutation.isPending}
      />
    </div>
  );
};

export default TreatmentsListView;
