import Badge from '../../../shared/components/ui/Badge';
import type { Patient } from '../types/patient.types';

interface PatientCardProps {
  patient: Patient;
}

const SEX_LABELS: Record<string, string> = {
  male: 'Masculino',
  female: 'Femenino',
  other: 'Otro',
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' });
}

function calculateAge(dateStr: string): number {
  const birth = new Date(dateStr);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export default function PatientCard({ patient }: PatientCardProps) {
  const rows = [
    { label: 'Sexo', value: SEX_LABELS[patient.sex] || patient.sex },
    { label: 'Fecha de nacimiento', value: `${formatDate(patient.dateOfBirth)} (${calculateAge(patient.dateOfBirth)} años)` },
    { label: 'Teléfono', value: patient.phone },
    { label: 'Correo', value: patient.email || '—' },
    { label: 'Dirección', value: patient.address || '—' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          {patient.firstName} {patient.lastName}
        </h2>
        <Badge
          className={
            patient.isActive
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }
        >
          {patient.isActive ? 'Activo' : 'Inactivo'}
        </Badge>
      </div>

      <dl className="space-y-2">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col sm:flex-row sm:gap-2">
            <dt className="text-xs font-medium text-gray-500 dark:text-gray-400 sm:w-40 shrink-0">
              {row.label}
            </dt>
            <dd className="text-sm text-gray-900 dark:text-white">{row.value}</dd>
          </div>
        ))}
      </dl>

      {/* Secciones médicas */}
      {(patient.medicalHistory || patient.allergies || patient.medications || patient.observations) && (
        <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
          {patient.medicalHistory && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Antecedentes Médicos</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{patient.medicalHistory}</p>
            </div>
          )}
          {patient.allergies && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Alergias</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{patient.allergies}</p>
            </div>
          )}
          {patient.medications && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Medicamentos</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{patient.medications}</p>
            </div>
          )}
          {patient.observations && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Observaciones</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{patient.observations}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
