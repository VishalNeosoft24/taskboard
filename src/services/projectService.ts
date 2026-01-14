import api from "@/lib/axios";

const API = process.env.NEXT_PUBLIC_API_URL;

export async function getProjectDetail(id: number) {
  const res = await api.get(`${API}/projects/${id}/`);
  return res.data;
}

export const fetchProjects = async ({ queryKey }: any) => {
  const [_key, paramsObj] = queryKey

  const params = new URLSearchParams();

  if (paramsObj.page) params.append("page", String(paramsObj.page)); else params.append("page", "1");
  if (paramsObj.search) params.append("search", paramsObj.search);
  if (paramsObj.projectId) params.append("id", paramsObj.projectId);
  if (paramsObj.project_search) params.append("project_search", paramsObj.project_search);
  if (paramsObj.role_filter) params.append("role_filter", paramsObj.role_filter);

  const res = await api.get(`/projects/?${params.toString()}`);
  return res.data; // Must return { count, next, previous, results }
};

export const updateProject = async (id: number, data: any) => {
  const res = await api.put(`/projects/${id}/`, data);
  return res.data;
};

export const deleteProject = async (projectId: number) => {
  const res = await api.delete(`/projects/${projectId}/`);
  return res.data;
};

export const getProjectTaskSummary = async (projectId: number) => {
  const res = await api.get(`/analytics/project-task-summary/${projectId}/`);
  return res.data;
};

