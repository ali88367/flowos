export interface DailyLog {
  id: string;
  date: string; // YYYY-MM-DD, unique per day
  wins: string;
  notes: string;
  ideas: string;
  hoursWorked: number;
  createdAt: string;
  updatedAt: string;
}

export type DailyLogDraft = Partial<
  Pick<DailyLog, 'wins' | 'notes' | 'ideas' | 'hoursWorked'>
>;
