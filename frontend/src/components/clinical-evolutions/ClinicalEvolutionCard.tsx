import type { ClinicalEvolution } from '../../types';
import {
  DETAIL_INFO_GRID_CLASS,
  DETAIL_INFO_TILE_CLASS,
} from '../ui/detailInfoLayout';

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

interface FieldTileProps {
  label: string;
  value: string;
  fullWidth?: boolean;
}

const FieldTile = ({ label, value, fullWidth }: FieldTileProps) => (
  <div
    className={[DETAIL_INFO_TILE_CLASS, fullWidth ? 'sm:col-span-2' : ''].filter(Boolean).join(' ')}
  >
    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</p>
    <p className="text-sm font-medium text-slate-900 dark:text-white whitespace-pre-line wrap-break-word">
      {value || '—'}
    </p>
  </div>
);

const ClinicalEvolutionCard = ({ evolution }: ClinicalEvolutionCardProps) => {
  const doctorName = evolution.doctor
    ? `Dr. ${evolution.doctor.firstName} ${evolution.doctor.lastName}`
    : '—';

  return (
    <div className="rounded-md border border-slate-200/80 dark:border-slate-700 bg-slate-50/40 dark:bg-slate-800/20 p-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
          {formatDate(evolution.date)}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">{doctorName}</span>
      </div>

      <div className={DETAIL_INFO_GRID_CLASS}>
        <FieldTile label="Motivo de consulta" value={evolution.consultationReason} />
        <FieldTile label="Hallazgos" value={evolution.findings} />
        <FieldTile label="Diagnóstico" value={evolution.diagnosis} />
        <FieldTile label="Procedimiento realizado" value={evolution.procedurePerformed} />
        {evolution.recommendations && (
          <FieldTile label="Recomendaciones" value={evolution.recommendations} fullWidth />
        )}
        {evolution.observations && (
          <FieldTile label="Observaciones" value={evolution.observations} fullWidth />
        )}
      </div>
    </div>
  );
};

export default ClinicalEvolutionCard;
