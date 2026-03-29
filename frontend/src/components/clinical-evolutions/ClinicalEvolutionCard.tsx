import type { ClinicalEvolution } from '../../types';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

interface ClinicalEvolutionCardProps {
  evolution: ClinicalEvolution;
}

const ClinicalEvolutionCard = ({ evolution }: ClinicalEvolutionCardProps) => {
  const doctorName = evolution.doctor
    ? `Dr. ${evolution.doctor.firstName} ${evolution.doctor.lastName}`
    : '—';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 space-y-3">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          {formatDate(evolution.date)}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">{doctorName}</span>
      </div>

      {/* Secciones */}
      <div className="space-y-3">
        <Field label="Motivo de consulta" value={evolution.consultationReason} />
        <Field label="Hallazgos" value={evolution.findings} />
        <Field label="Diagnóstico" value={evolution.diagnosis} />
        <Field label="Procedimiento realizado" value={evolution.procedurePerformed} />
        {evolution.recommendations && (
          <Field label="Recomendaciones" value={evolution.recommendations} />
        )}
        {evolution.observations && (
          <Field label="Observaciones" value={evolution.observations} />
        )}
      </div>
    </div>
  );
};

interface FieldProps {
  label: string;
  value: string;
}

const Field = ({ label, value }: FieldProps) => (
  <div>
    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-0.5">
      {label}
    </h4>
    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">{value}</p>
  </div>
);

export default ClinicalEvolutionCard;
