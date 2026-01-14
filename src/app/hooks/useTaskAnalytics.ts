import { useQuery } from "@tanstack/react-query";
import api from '@/lib/axios';

export function useTaskStatusAnalytics() {
  return useQuery({
    queryKey: ["task-status-analytics"],
    queryFn: async () => {
      const res = await api.get("/analytics/task-status-chart/");
      return res.data;
    }
  });
}

export function useWeeklyAnalytics() {
  return useQuery({
    queryKey: ["weekly-task-analytics"],
    queryFn: async () => {
      const res = await api.get("/analytics/task-weekly-chart/");
      return res.data;
    }
  });
}
