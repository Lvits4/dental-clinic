import { addDays, startOfDay } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

/**
 * Rango [start, end) en UTC que corresponde al día civil en `timeZone` (IANA).
 * Evita que el dashboard use medianoche del proceso (a menudo UTC en Docker)
 * cuando las citas se interpretan en horario de la clínica.
 */
export function getZonedDayRangeUtc(
  timeZone: string,
  reference: Date = new Date(),
): { start: Date; end: Date } {
  const zonedNow = toZonedTime(reference, timeZone);
  const zonedStart = startOfDay(zonedNow);
  const start = fromZonedTime(zonedStart, timeZone);
  const end = fromZonedTime(addDays(zonedStart, 1), timeZone);
  return { start, end };
}
