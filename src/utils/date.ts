import {
  format,
  isToday as fnsIsToday,
  isPast as fnsIsPast,
  isTomorrow,
  startOfDay,
  formatDistanceToNow,
} from 'date-fns';

export function todayKey(date: Date = new Date()): string {
  return format(date, 'yyyy-MM-dd');
}

/**
 * Parses a date-only "yyyy-MM-dd" string (or the date portion of an ISO
 * timestamp) as a local calendar date, avoiding the UTC-midnight shift that
 * `new Date("yyyy-MM-dd")` introduces in negative UTC-offset timezones.
 */
export function parseDateOnly(dateStr: string): Date {
  const [year, month, day] = dateStr.split('T')[0].split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function isToday(dateStr?: string): boolean {
  if (!dateStr) return false;
  return fnsIsToday(parseDateOnly(dateStr));
}

export function isOverdue(dateStr?: string): boolean {
  if (!dateStr) return false;
  const d = parseDateOnly(dateStr);
  return fnsIsPast(startOfDay(d)) && !fnsIsToday(d);
}

export function isUpcoming(dateStr?: string): boolean {
  if (!dateStr) return false;
  const d = parseDateOnly(dateStr);
  return !fnsIsToday(d) && !fnsIsPast(startOfDay(d));
}

export function formatDueDate(dateStr?: string): string {
  if (!dateStr) return '';
  const d = parseDateOnly(dateStr);
  if (fnsIsToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  return format(d, 'MMM d');
}

export function formatFullDate(date: Date = new Date()): string {
  return format(date, 'EEEE, MMMM d');
}

export function formatRelativeTime(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
}

export function greeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}
