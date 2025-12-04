import api from "@/lib/axios";


const API = process.env.NEXT_PUBLIC_API_URL;

export async function getProjectDetail(id: number) {
  const res = await api.get(`${API}/projects/${id}/`);
  return res.data;
}

export const fetchProjects = async ({ queryKey }: any) => {
  const [_key, page, filters] = queryKey;

  const params = new URLSearchParams();
  if (page) params.append("page", String(page));
  if (filters.search) params.append("search", filters.search);

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
