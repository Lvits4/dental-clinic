import { useNavigate } from 'react-router-dom';
import Table, { type Column } from '../../../../common/components/Table/Table';
import Badge from '../../../../common/components/Badge/Badge';
import type { Patient } from '../../types/patient.types';

interface PatientsTableProps {
  data: Patient[];
  loading?: boolean;
}

const SEX_LABELS: Record<string, string> = {
  male: 'M',
  female: 'F',
  other: 'Otro',
};

const PatientsTable = ({ data, loading }: PatientsTableProps) => {
  const navigate = useNavigate();

  const columns: Column<Patient>[] = [
    {
      key: 'name',
      header: 'Nombre',
      render: (p) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {p.firstName} {p.lastName}
        </span>
      ),
    },
    {
      key: 'sex',
      header: 'Sexo',
      render: (p) => SEX_LABELS[p.sex] || p.sex,
    },
    {
      key: 'phone',
      header: 'Teléfono',
    },
    {
      key: 'email',
      header: 'Correo',
      render: (p) => p.email || '—',
    },
    {
      key: 'isActive',
      header: 'Estado',
      render: (p) => (
        <Badge
          className={
            p.isActive
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }
        >
          {p.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
  ];

  return (
    <Table<Patient>
      columns={columns}
      data={data}
      keyExtractor={(p) => p.id}
      onRowClick={(p) => navigate(`/patients/${p.id}`)}
      loading={loading}
      emptyMessage="No se encontraron pacientes"
    />
  );
};

export default PatientsTable;
