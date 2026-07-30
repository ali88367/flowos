import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { DailyLog, DailyLogDraft } from '@/types';
import { getOrCreateTodayLog, listDailyLogs, updateDailyLog } from '@/services';

export const dailyLogKeys = {
  all: ['daily-logs'] as const,
  today: ['daily-logs', 'today'] as const,
};

export function useDailyLogs() {
  return useQuery({
    queryKey: dailyLogKeys.all,
    queryFn: listDailyLogs,
  });
}

export function useTodayLog() {
  return useQuery({
    queryKey: dailyLogKeys.today,
    queryFn: getOrCreateTodayLog,
  });
}

export function useUpdateDailyLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: DailyLogDraft }) => updateDailyLog(id, patch),
    onMutate: async ({ id, patch }) => {
      await queryClient.cancelQueries({ queryKey: dailyLogKeys.today });
      const previous = queryClient.getQueryData<DailyLog>(dailyLogKeys.today);
      if (previous && previous.id === id) {
        queryClient.setQueryData<DailyLog>(dailyLogKeys.today, { ...previous, ...patch });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(dailyLogKeys.today, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: dailyLogKeys.today });
      queryClient.invalidateQueries({ queryKey: dailyLogKeys.all });
    },
  });
}
