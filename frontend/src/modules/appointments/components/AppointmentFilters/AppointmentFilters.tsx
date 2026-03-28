import Select from '../../../../common/components/Select/Select';
import Input from '../../../../common/components/Input/Input';
import { STATUS_OPTIONS } from '../../types/appointment.types';
import type { Doctor } from '../../../doctors/types/doctor.types';

interface AppointmentFiltersProps {
  status: string;
  onStatusChange: (value: string) => void;
  doctorId: string;
  onDoctorChange: (value: string) => void;
  dateFrom: string;
  onDateFromChange: (value: string) => void;
  dateTo: string;
  onDateToChange: (value: string) => void;
  doctors: Doctor[];
}

const AppointmentFilters = ({
  status,
  onStatusChange,
  doctorId,
  onDoctorChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  doctors,
}: AppointmentFiltersProps) => {
  const doctorOptions = doctors.map((d) => ({
    value: d.id,
    label: `Dr. ${d.firstName} ${d.lastName}`,
  }));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <Select
        options={STATUS_OPTIONS}
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        placeholder="Todos los estados"
      />
      <Select
        options={doctorOptions}
        value={doctorId}
        onChange={(e) => onDoctorChange(e.target.value)}
        placeholder="Todos los doctores"
      />
      <Input
        type="date"
        value={dateFrom}
        onChange={(e) => onDateFromChange(e.target.value)}
        placeholder="Desde"
      />
      <Input
        type="date"
        value={dateTo}
        onChange={(e) => onDateToChange(e.target.value)}
        placeholder="Hasta"
      />
    </div>
  );
};

export default AppointmentFilters;
