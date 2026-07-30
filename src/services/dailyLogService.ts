import type { DailyLog, DailyLogDraft } from '@/types';
import { generateId } from '@/utils/id';
import { todayKey } from '@/utils/date';
import { dailyLogAdapter } from './db/adapters';

export async function listDailyLogs(): Promise<DailyLog[]> {
  const logs = await dailyLogAdapter.list();
  return logs.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getOrCreateTodayLog(): Promise<DailyLog> {
  const logs = await dailyLogAdapter.list();
  const key = todayKey();
  const existing = logs.find((log) => log.date === key);
  if (existing) return existing;

  const now = new Date().toISOString();
  const log: DailyLog = {
    id: generateId(),
    date: key,
    wins: '',
    notes: '',
    ideas: '',
    hoursWorked: 0,
    createdAt: now,
    updatedAt: now,
  };
  return dailyLogAdapter.create(log);
}

export async function updateDailyLog(id: string, patch: DailyLogDraft): Promise<DailyLog> {
  return dailyLogAdapter.update(id, { ...patch, updatedAt: new Date().toISOString() });
}
