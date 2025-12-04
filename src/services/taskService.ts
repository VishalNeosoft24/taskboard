// src/services/taskService.ts
import api from '@/lib/axios';

// Fetch all tasks
// export const fetchTasks = async () => {
//   const res = await api.get('/tasks/');
//   return res.data; // assuming the API returns { tasks: [...] }
// };

export const fetchTasks = async ({ queryKey }: any) => {
  const [_key, page, filters] = queryKey;
  const params = new URLSearchParams();
  
  if (page){
    params.append("page", String(page));
  }

  if (filters.search) params.append("search", filters.search);
  if (filters.status) params.append("status", filters.status);
  if (filters.priority) params.append("priority", filters.priority);
  if (filters.project) params.append("project", filters.project);


  const res = await api.get(`/tasks/?${params.toString()}`);
  return res.data;
};

// Fetch single task by ID
export const fetchTask = async (id: number) => {
  const res = await api.get(`/tasks/${id}/`);
  console.log(`Task ${id} API response:`, res.data);
  return res.data.task;
};

// Create new task
export const createTask = async (payload: { title: string; description?: string; project?: number; priority?: string }) => {
  const res = await api.post('/tasks/', payload);
  return res.data;
};

// Update task by ID
export const updateTask = async (id: number, payload: { title?: string; description?: string; status?: string; priority?: string; project?: number }) => {
  const res = await api.patch(`/tasks/${id}/`, payload);
  return res.data;
};

// Delete task by ID
export const deleteTask = async (id: number) => {
  const res = await api.delete(`/tasks/${id}/`);
  return res.data;
};
