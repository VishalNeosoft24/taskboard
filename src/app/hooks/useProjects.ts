import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProjects, deleteProject } from "@/services/projectService";
import api from "@/lib/axios";
import { addProjectMember, removeProjectMember } from "@/services/memberService";

export function useProjects() {
  const queryClient = useQueryClient();

  // 🚀 GET LIST OF PROJECTS
  const list = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
    staleTime: 1000 * 60,
  });

  // 🚀 ADD PROJECT
  const add = useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const res = await api.post("/projects/", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  // 🚀 DELETE PROJECT
  const deleteProjectMutation = useMutation({
    mutationFn: (projectId: number) => deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  // 🚀 ADD MEMBER
  const addMember = useMutation({
    mutationFn: (payload: any) => addProjectMember(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  // REMOVE MEMBER
  const removeMember = useMutation({
    mutationFn: ({ projectId, memberId }: any) =>
      removeProjectMember(projectId, memberId),
  });

  return {
    list,
    add,
    deleteProject: deleteProjectMutation,
    addMember,
    removeMember,
  };
}
