// useProjectSearch.ts
import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "@/services/projectService";
import { useDebounce } from "./useDebounce";

export function useProjectSearch(query: string) {
  const debounced = useDebounce(query, 500);

  return useQuery({
    queryKey: ["projects-search", { project_search: debounced }],
    queryFn: fetchProjects,
  });
}
