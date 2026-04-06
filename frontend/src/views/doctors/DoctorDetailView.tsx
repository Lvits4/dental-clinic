import { Link, useParams } from 'react-router-dom';
import { PageHeader, Badge, Button, Card, Spinner } from '../../components/ui';
import { useDoctorDetail } from '../../querys/doctors/queryDoctors';
import type { DoctorModalLocationState } from './DoctorRouteRedirects';

const DoctorDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const { data: doctor, isPending: doctorLoading } = useDoctorDetail(id!);

  if (doctorLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 dark:text-slate-400">Doctor no encontrado</p>
      </div>
    );
  }

  const rows = [
    { label: 'Especialidad', value: doctor.specialty },
    { label: 'Teléfono', value: doctor.phone },
    { label: 'Correo', value: doctor.email },
    { label: 'Licencia', value: doctor.licenseNumber },
  ];

  return (
    <div className="flex flex-col gap-3 flex-1 min-h-0 sm:gap-4">
      <PageHeader
        dense
        titleTone="subtle"
        title="Ficha del doctor"
        subtitle={`Dr. ${doctor.firstName} ${doctor.lastName}`}
        breadcrumb={[
          { label: 'Inicio', to: '/' },
          { label: 'Doctores', to: '/doctors' },
          { label: `Dr. ${doctor.firstName} ${doctor.lastName}` },
        ]}
        action={
          <Link
            className="block w-full sm:inline-block sm:w-auto"
            to="/doctors"
            viewTransition
            state={
              {
                openDoctorModal: 'edit',
                doctorId: id!,
              } satisfies DoctorModalLocationState
            }
          >
            <Button
              variant="secondary"
              className="h-10 min-h-10 w-full shrink-0 rounded-md py-0! px-4 whitespace-nowrap sm:w-auto"
            >
              Editar
            </Button>
          </Link>
        }
      />

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">
            Dr. {doctor.firstName} {doctor.lastName}
          </h2>
          <Badge
            className={
              doctor.isActive
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }
          >
            {doctor.isActive ? 'Activo' : 'Inactivo'}
          </Badge>
        </div>

        <dl className="space-y-2">
          {rows.map((row) => (
            <div key={row.label} className="flex flex-col sm:flex-row sm:gap-2">
              <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:w-32 shrink-0">
                {row.label}
              </dt>
              <dd className="text-sm text-slate-900 dark:text-white">{row.value}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
};

export default DoctorDetailView;
