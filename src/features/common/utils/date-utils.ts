import { Dayjs } from 'dayjs';

const COMMON_DATETIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
const COMMON_DATE_FORMAT = 'YYYY-MM-DD';
const COMMON_DATE_FORMAT_WITH_MONTH = 'MMMM DD, YYYY';

/**
 * Used to convert datetime to string (ISO 8601 format)
 * (used for supabase datetimes, among other things)
 */
export function toDatetimeString(datetime: Dayjs): string {
  return datetime.format(COMMON_DATETIME_FORMAT);
}

export function toDateString(datetime: Dayjs): string {
  return datetime.format(COMMON_DATE_FORMAT);
}

export function toDateStringWithMonth(datetime: Dayjs): string {
  return datetime.format(COMMON_DATE_FORMAT_WITH_MONTH);
}
