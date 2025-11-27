// services/memberService.ts
import api from "@/lib/axios";


export const getProjectMembers = async (projectId: number) => {
  const res = await api.get(`/projects/${projectId}/members/`);
  return res.data.members;
};

export const removeProjectMember = async (projectId: number, memberId: number) => {
  return api.delete(`/projects/${projectId}/members/${memberId}/remove/`);
};

export const addProjectMember = async (data: {
  project: number;
  user: number;
  role: string;
}) => {
  const res = await api.post("/projects/member/add/", data);
  return res.data;
};