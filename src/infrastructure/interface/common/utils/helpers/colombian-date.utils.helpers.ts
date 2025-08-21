import { toZonedTime } from 'date-fns-tz';
import { format } from 'date-fns';

export const colombianDatesFormatter = (): Date => {
  const timeZone = 'America/Bogota';

  // Obtener la hora actual en Colombia
  const now = new Date();
  return toZonedTime(now, timeZone);
};
