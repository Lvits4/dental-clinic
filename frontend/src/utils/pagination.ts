import type { PaginationMeta } from '../types';

type MetaLike = Partial<Pick<PaginationMeta, 'totalItems' | 'totalPages' | 'limit'>> | undefined;

/**
 * Número de páginas fiable a partir de la meta del API.
 * Evita `NaN` cuando `totalPages` viene ausente (p. ej. `Math.max(1, undefined)`).
 */
export function totalPagesFromMeta(meta: MetaLike, fallbackLimit: number): number {
  const limit = Math.max(1, Number(meta?.limit) || fallbackLimit);
  const totalItems = Math.max(0, Number(meta?.totalItems) || 0);
  const raw = meta?.totalPages;
  if (typeof raw === 'number' && Number.isFinite(raw) && raw >= 1) {
    return Math.floor(raw);
  }
  if (totalItems === 0) return 1;
  return Math.max(1, Math.ceil(totalItems / limit));
}
