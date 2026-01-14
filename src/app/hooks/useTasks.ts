// src/hooks/useTasks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTasks, createTask, fetchTask, updateTask } from "@/services/taskService";

export function useTasks(page?: number, filters: any = {}) {
  const qc = useQueryClient();

  // Fetch all tasks
  const list = useQuery({
    queryKey: ["tasks", page, filters],
    queryFn: fetchTasks,
    staleTime: 1000 * 60,
    keepPreviousData: true,
  });

  // Add new task
  const add = useMutation({
    mutationFn: createTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks"] }),
  });

  // Fetch single task by ID
  const getTask = (taskId: number) =>
    useQuery({
      queryKey: ["task", taskId],
      queryFn: () => fetchTask(taskId),
      staleTime: 1000 * 60,
    });

  // Update a task by ID
  const updateTaskById = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateTask(id, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["tasks"] });
      qc.invalidateQueries({ queryKey: ["task", variables.id] });
    },
  });

  return { list, add, getTask, updateTaskById };
}
