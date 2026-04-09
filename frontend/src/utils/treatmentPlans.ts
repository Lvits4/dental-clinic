import type { TreatmentPlan } from '../types';

const PLAN_SELECT_TITLE_MAX = 72;

/** Etiqueta del plan en selects: prioriza observaciones (título); sin fecha ni estado. */
export function getPlanSelectLabel(plan: TreatmentPlan): string {
  const raw = plan.observations?.trim();
  if (raw) {
    const line = raw.split('\n')[0]!.trim();
    return line.length > PLAN_SELECT_TITLE_MAX
      ? `${line.slice(0, PLAN_SELECT_TITLE_MAX - 1)}…`
      : line;
  }
  return 'Plan sin título';
}

/**
 * Procedimientos realizados asociados al plan en la lista.
 * Prioriza `proceduresPerformedCount` del API (vínculo explícito al plan o a un ítem del plan).
 * Si no viene, suma `performedProcedures` por ítem.
 */
export function countPerformedProceduresOnPlan(p: TreatmentPlan): number {
  if (typeof p.proceduresPerformedCount === 'number') {
    return p.proceduresPerformedCount;
  }
  return (p.items ?? []).reduce(
    (acc, item) => acc + (item.performedProcedures?.length ?? 0),
    0,
  );
}
