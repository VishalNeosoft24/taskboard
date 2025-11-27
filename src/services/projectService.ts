import api from "@/lib/axios";


const API = process.env.NEXT_PUBLIC_API_URL;

export async function getProjectDetail(id: number) {
  const res = await api.get(`${API}/projects/${id}/`);
  return res.data;
}

export const fetchProjects = async () => {
  const res = await api.get("/projects/");
  return res.data.results ?? res.data;
};

export const updateProject = async (id: number, data: any) => {
  const res = await api.put(`/projects/${id}/`, data);
  return res.data;
};

export const deleteProject = async (projectId: number) => {
  const res = await api.delete(`/projects/${projectId}/`);
  return res.data;
};
