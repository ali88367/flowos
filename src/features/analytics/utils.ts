import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  subDays,
  format,
} from 'date-fns';
import type { Task } from '@/types';
import { parseDateOnly } from '@/utils/date';

export function tasksCompletedInRange(tasks: Task[], start: Date, end: Date): Task[] {
  return tasks.filter(
    (t) => t.completed && t.completedAt && isWithinInterval(new Date(t.completedAt), { start, end }),
  );
}

export function weekRange(date: Date = new Date()) {
  return { start: startOfWeek(date, { weekStartsOn: 1 }), end: endOfWeek(date, { weekStartsOn: 1 }) };
}

export function monthRange(date: Date = new Date()) {
  return { start: startOfMonth(date), end: endOfMonth(date) };
}

export function tasksDueInRange(tasks: Task[], start: Date, end: Date): Task[] {
  return tasks.filter((t) => t.dueDate && isWithinInterval(parseDateOnly(t.dueDate), { start, end }));
}

export function completionRate(due: Task[]): number {
  if (due.length === 0) return 0;
  const done = due.filter((t) => t.completed).length;
  return Math.round((done / due.length) * 100);
}

export function currentStreak(tasks: Task[]): number {
  const completedDates = new Set(
    tasks.filter((t) => t.completed && t.completedAt).map((t) => format(new Date(t.completedAt!), 'yyyy-MM-dd')),
  );

  let streak = 0;
  let cursor = new Date();

  if (!completedDates.has(format(cursor, 'yyyy-MM-dd'))) {
    cursor = subDays(cursor, 1);
  }

  while (completedDates.has(format(cursor, 'yyyy-MM-dd'))) {
    streak += 1;
    cursor = subDays(cursor, 1);
  }

  return streak;
}
