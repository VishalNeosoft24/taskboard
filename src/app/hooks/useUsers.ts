import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/users/";

export const useUsers = (page = 1, search = "") => {
  const queryClient = useQueryClient();

  const list = useQuery({
    queryKey: ["users", page, search], // ✅ FIXED
    queryFn: async () => {
      let queryparams = `?page=${page}`;
      if (search) {
        queryparams += `&search=${search}`;
      }
      const res = await axios.get(`${API_URL}${queryparams}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      return res.data;
    },
    keepPreviousData: true, // ✅ smooth infinite scroll
    enabled: !!search || page > 0, // important

  });

  const update = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: unknown }) => {
      const res = await axios.patch(`${API_URL}${id}/`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return { list, update };
};
